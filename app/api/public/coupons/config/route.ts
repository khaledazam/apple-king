import { NextResponse } from 'next/server';
import { getStorefrontDb } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTING = {
  isActive: true,
  discountType: 'percentage',
  discountValue: 5,
  maxDiscountAmount: 500,
  validityDays: 7,
  minProductPrice: 0,
  buttonText: 'احصل على قسيمة خصم بالفرع',
  badgeText: 'كوبون فوري',
  termsAr:
    'يتم إبراز كود الخصم للكاشير عند الشراء بالفرع (السنبلاوين - شارع مصطفى كامل أمام بن بهاء). الخصم ساري لمدة 7 أيام من تاريخ الإصدار.',
};

export async function GET() {
  try {
    const db = await getStorefrontDb();
    const collection = db.collection('storefrontpromosettings');
    const setting = await collection.findOne();

    return NextResponse.json(
      {
        status: 'success',
        data: {
          setting: setting || DEFAULT_SETTING,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (err: any) {
    console.error('Error fetching promo settings:', err);
    return NextResponse.json(
      {
        status: 'success',
        data: { setting: DEFAULT_SETTING },
      },
      { status: 200 }
    );
  }
}
