import { NextRequest, NextResponse } from 'next/server';
import { getStorefrontDb } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

function generateCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AK-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, productTitle, productSlug, productPrice } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { status: 'error', message: 'يرجى إدخال الاسم ورقم الهاتف بشكل صحيح.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(customerPhone).replace(/\s+/g, '').replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { status: 'error', message: 'رقم الهاتف غير صالح، يرجى إدخال 11 رقم.' },
        { status: 400 }
      );
    }

    const db = await getStorefrontDb();
    const couponsCollection = db.collection('coupons');

    // Check if customer already has an active coupon within last 48 hours
    const existing = await couponsCollection.findOne({
      customerPhone: cleanPhone,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (existing) {
      return NextResponse.json({
        status: 'success',
        message: 'لديك قسيمة خصم نشطة بالفعل يمكنك استخدامها بالفرع.',
        data: {
          coupon: {
            code: existing.code,
            customerName: existing.customerName,
            customerPhone: existing.customerPhone,
            productTitle: existing.productTitle,
            discountValue: existing.discountValue || 5,
            calculatedDiscount: existing.calculatedDiscount || 500,
            expiresAt: existing.expiresAt,
          },
          isExisting: true,
        },
      });
    }

    // Generate unique code
    let code = generateCode();
    let exists = await couponsCollection.findOne({ code });
    let attempts = 0;
    while (exists && attempts < 10) {
      code = generateCode();
      exists = await couponsCollection.findOne({ code });
      attempts++;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const priceNum = Number(productPrice) || 0;
    const calculatedDiscount = priceNum > 0 ? Math.min(Math.round(priceNum * 0.05), 500) : 500;

    const newCoupon = {
      code,
      customerName: String(customerName).trim(),
      customerPhone: cleanPhone,
      productTitle: productTitle ? String(productTitle).trim() : 'هاتف ذكي من الاستور',
      productSlug: productSlug ? String(productSlug).trim() : '',
      productPrice: priceNum,
      discountType: 'percentage',
      discountValue: 5,
      maxDiscountAmount: 500,
      calculatedDiscount,
      isUsed: false,
      usedAt: null,
      usedInSale: null,
      usedBy: null,
      expiresAt,
      branch: 'الفرع الرئيسي - السنبلاوين',
      source: 'storefront',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await couponsCollection.insertOne(newCoupon);

    return NextResponse.json(
      {
        status: 'success',
        message: 'تم إصدار قسيمة الخصم بنجاح!',
        data: {
          coupon: {
            code: newCoupon.code,
            customerName: newCoupon.customerName,
            customerPhone: newCoupon.customerPhone,
            productTitle: newCoupon.productTitle,
            discountValue: newCoupon.discountValue,
            calculatedDiscount: newCoupon.calculatedDiscount,
            expiresAt: newCoupon.expiresAt,
          },
          isExisting: false,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error claiming coupon:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'حدث خطأ أثناء إصدار كود الخصم، يرجى المحاولة مرة أخرى.',
      },
      { status: 500 }
    );
  }
}
