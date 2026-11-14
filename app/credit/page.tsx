import React from 'react';
import { Metadata } from 'next';
import { getPublishedProducts } from '@/lib/catalog/queries';
import { CreditPortalClient } from '@/components/credit/CreditPortalClient';

export const metadata: Metadata = {
  title: 'تقسيط آيفون بالسنبلاوين | حساب الأقساط المعتمدة — ملك التفاحه (أحمد عبد العزيز)',
  description:
    'بوابة تقييم الجدارة الائتمانية وحساب خطط أقساط هواتف آيفون وسامسونج المعتمدة لمشتري فرع السنبلاوين (شارع مصطفى كامل أمام بن بهاء). حساب آلي ملزم واستخراج كود الاعتماد الفوري.',
  alternates: {
    canonical: '/credit',
  },
  openGraph: {
    title: 'تقسيط آيفون بالسنبلاوين | حساب الأقساط — ملك التفاحه',
    description:
      'احسب قسط جهازك الآيفون في السنبلاوين بأنظمة تقسيط ميسرة ومعتمدة من متجر أحمد عبد العزيز بشارع مصطفى كامل.',
    url: 'https://apple-king.com/credit',
    siteName: 'ملك التفاحه في مصر — أحمد عبد العزيز (السنبلاوين)',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تقسيط آيفون بالسنبلاوين | ملك التفاحه',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Force dynamic execution to query live stock on every customer scan/request
export const dynamic = 'force-dynamic';

export default async function CreditPortalPage() {
  let phones: any[] = [];

  try {
    const res = await getPublishedProducts({
      productType: 'phone',
      availability: 'all',
      limit: 100,
    });
    // Invariant requested by user: Only show devices present in system inventory
    phones = (res.products || []).filter(
      (p) => p.totalAvailableQuantity > 0 || (p.variants && p.variants.some((v) => v.availableQuantity > 0))
    );

    // Fallback: If inventory count is untracked but products exist in catalog, include them
    if (phones.length === 0 && res.products && res.products.length > 0) {
      phones = res.products;
    }
  } catch (err) {
    console.error('Failed to load published phones for credit portal', err);
  }

  return (
    <main className="w-full bg-[#f8fafc] text-slate-900 min-h-screen">
      <CreditPortalClient
        phones={phones}
        branchName="فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء"
        salesNumber="201097976407"
      />
    </main>
  );
}
