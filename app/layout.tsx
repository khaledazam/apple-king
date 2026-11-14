import { MotionProvider } from '@/components/ui/MotionPrimitives';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king.com';

export const metadata: Metadata = {
  title: {
    default: 'ملك التفاحه في مصر | أحمد عبد العزيز — أسعار الآيفون في السنبلاوين',
    template: '%s | أسعار الآيفون بالسنبلاوين - ملك التفاحه (أحمد عبد العزيز)',
  },
  description:
    'متجر ملك التفاحه بإدارة أحمد عبد العزيز في السنبلاوين (شارع مصطفى كامل أمام بن بهاء). دليلك الأقوى لأحدث أسعار الآيفون (iPhone) كاش وبالتقسيط، هواتف أصلية وأجهزة كسر زيرو بضمان معتمد لمركز السنبلاوين والدقهلية.',
  keywords: [
    // أسعار الآيفون
    'اسعار الايفونات',
    'اسعار الايفون',
    'اسعار الايفون في مصر',
    'اسعار الايفون في السنبلاوين',
    'اسعار الايفونات اليوم',
    'اسعار الايفون اليوم في مصر',
    'سعر ايفون 16 برو ماكس السنبلاوين',
    'سعر ايفون 16 بالسنبلاوين',
    'سعر ايفون 15 برو ماكس السنبلاوين',
    'سعر ايفون 15 بالسنبلاوين',
    'اسعار ايفون 14 بالسنبلاوين',
    'اسعار ايفون 13 بالسنبلاوين',
    'اسعار ايفون 11 و 12 السنبلاوين',
    'اسعار الايفون المستعمل بالسنبلاوين',
    'اسعار ايفون كسر زيرو السنبلاوين',
    'ارخص سعر ايفون في السنبلاوين',
    'عروض اسعار الايفون بالسنبلاوين',
    // السنبلاوين ومركز السنبلاوين
    'السنبلاوين',
    'مركز السنبلاوين',
    'مدينة السنبلاوين',
    'ايفون السنبلاوين',
    'ايفونات السنبلاوين',
    'محل ايفون السنبلاوين',
    'محلات موبايل السنبلاوين',
    'محلات تليفونات السنبلاوين',
    'موبايلات السنبلاوين',
    'تليفونات السنبلاوين',
    'شارع مصطفى كامل السنبلاوين',
    'شارع مصطفى كامل امام بن بهاء',
    'تقسيط موبايلات السنبلاوين',
    'تقسيط ايفون السنبلاوين',
    'صيانة ايفون السنبلاوين',
    'تبديل ايفون السنبلاوين',
    'بيع وشراء ايفون السنبلاوين',
    'دكان ايفون السنبلاوين',
    // أحمد عبد العزيز
    'احمد عبدالعزيز',
    'أحمد عبد العزيز',
    'احمد عبدالعزيز السنبلاوين',
    'أحمد عبد العزيز السنبلاوين',
    'احمد عبدالعزيز ملك التفاحه',
    'أحمد عبد العزيز ملك التفاحه',
    'محل احمد عبدالعزيز',
    'محل احمد عبدالعزيز بالسنبلاوين',
    'تليفون احمد عبدالعزيز السنبلاوين',
    'احمد عبد العزيز ايفون',
    'ملك التفاحه احمد عبدالعزيز',
    // العلامة التجارية
    'ملك التفاحه',
    'ملك التفاحه في مصر',
    'ملك التفاحه السنبلاوين',
    'Apple King',
    'Apple King Egypt',
    'Apple King Senbellawein',
    // قرى ومراكز الدقهلية
    'السنبلاوين الدقهلية',
    'برهمتوش السنبلاوين',
    'شبراهور السنبلاوين',
    'الحجايزة السنبلاوين',
    'برقين السنبلاوين',
    'طنبارة السنبلاوين',
    'ميت غريطة السنبلاوين',
    'البوها السنبلاوين',
    'كفر الروك السنبلاوين',
    'ديو الوسطى السنبلاوين',
    'تمي الامديد',
    'ديرب نجم',
    'المنصورة الدقهلية',
    'سامسونج السنبلاوين',
  ],
  authors: [{ name: 'أحمد عبد العزيز (ملك التفاحه)' }],
  creator: 'ملك التفاحه — أحمد عبد العزيز',
  publisher: 'ملك التفاحه',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ملك التفاحه في مصر | أحمد عبد العزيز — أسعار الآيفون في السنبلاوين',
    description:
      'تعرف على أحدث أسعار هواتف آيفون وسامسونج الأصلية والكسر زيرو في السنبلاوين (شارع مصطفى كامل أمام بن بهاء). كاش وتقسيط واستبدال فوري بإدارة أحمد عبد العزيز.',
    url: BASE_URL,
    siteName: 'ملك التفاحه في مصر — أحمد عبد العزيز (السنبلاوين)',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ملك التفاحه في مصر | أحمد عبد العزيز — أسعار الآيفون بالسنبلاوين',
    description: 'أقوى عروض وأسعار الآيفون والهواتف الذكية في السنبلاوين ومحافظة الدقهلية. كاش وتقسيط وضمان معتمد.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  other: {
    'geo.region': 'EG-DK',
    'geo.placename': 'السنبلاوين، شارع مصطفى كامل، محافظة الدقهلية',
    'geo.position': '30.8525;31.4647',
    'ICBM': '30.8525, 31.4647',
  },
};

const structuredData = [
  // 1. Electronics Store Schema
  {
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    '@id': `${BASE_URL}/#store`,
    name: 'ملك التفاحه — أحمد عبد العزيز (أسعار الآيفون بالسنبلاوين)',
    alternateName: [
      'ملك التفاحه',
      'ملك التفاحه في مصر',
      'أحمد عبد العزيز ملك التفاحه',
      'احمد عبدالعزيز السنبلاوين',
      'محل ملك التفاحه السنبلاوين',
      'اسعار الايفونات السنبلاوين',
      'Apple King Senbellawein',
    ],
    description:
      'متجر ملك التفاحه بإدارة أحمد عبد العزيز في السنبلاوين، شارع مصطفى كامل أمام بن بهاء. المتخصص الأول في بيع وشراء وصيانة واستبدال هواتف آيفون وسامسونج الأصلية، كاش وبالتقسيط لأهالي مركز السنبلاوين ومحافظة الدقهلية.',
    url: BASE_URL,
    telephone: '+201097976407',
    priceRange: '$$$',
    currenciesAccepted: 'EGP',
    paymentAccepted: 'Cash, Credit Card, Installments, Trade-in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'السنبلاوين شارع مصطفي كامل امام بن بهاء',
      addressLocality: 'السنبلاوين',
      addressRegion: 'الدقهلية',
      postalCode: '35661',
      addressCountry: 'EG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.8525,
      longitude: 31.4647,
    },
    areaServed: [
      { '@type': 'City', name: 'السنبلاوين' },
      { '@type': 'AdministrativeArea', name: 'مركز السنبلاوين' },
      { '@type': 'City', name: 'برهمتوش' },
      { '@type': 'City', name: 'شبراهور' },
      { '@type': 'City', name: 'الحجايزة' },
      { '@type': 'City', name: 'برقين' },
      { '@type': 'City', name: 'طنبارة' },
      { '@type': 'City', name: 'ميت غريطة' },
      { '@type': 'City', name: 'البوها' },
      { '@type': 'City', name: 'كفر الروك' },
      { '@type': 'City', name: 'ديو الوسطى' },
      { '@type': 'City', name: 'تمي الأمديد' },
      { '@type': 'City', name: 'ديرب نجم' },
      { '@type': 'City', name: 'المنصورة' },
      { '@type': 'AdministrativeArea', name: 'الدقهلية' },
      { '@type': 'Country', name: 'مصر' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '12:00',
        closes: '24:00',
      },
    ],
  },
  // 2. FAQ Page Schema (Rich SERP Snippets)
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ما هي أسعار الآيفونات في السنبلاوين لدى متجر ملك التفاحه؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'يوفر متجر ملك التفاحه بإدارة أحمد عبد العزيز أحدث أسعار هواتف آيفون (iPhone) كاش وبالتقسيط بالسنبلاوين مع تحديث دوري يومي للأجهزة الجديدة والكسر زيرو مع فحص 30 نقطة وضمان معتمد.',
        },
      },
      {
        '@type': 'Question',
        name: 'أين يقع محل أحمد عبد العزيز (ملك التفاحه) في السنبلاوين وما هي مواعيد العمل؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'يقع متجر ملك التفاحه في قلب السنبلاوين بشارع مصطفى كامل أمام بن بهاء، ومفتوح يوميًا من الساعة 12:00 ظهرًا حتى الساعة 12:00 منتصف الليل (من 12 لـ 12) للاستلام والمعاينة الفورية.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل متاح تقسيط واستبدال الآيفون لأهالي مركز السنبلاوين؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، يقدم متجر أحمد عبد العزيز أنظمة تقسيط ميسرة وخدمة التبديل والاستبدال الفوري (Trade-in) لجهازك القديم بأعلى تقييم فوري كاش لأهالي السنبلاوين ومحافظة الدقهلية.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل أجهزة الآيفون الكسر زيرو مضمونة في متجر ملك التفاحه؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، جميع أجهزة الآيفون الكسر زيرو تخضع لفحص فني شامل للبطارية والشاشة وبصمة الوجه والكاميرات مع فاتورة رسمية وضمان استبدال معتمد.',
        },
      },
    ],
  },
  // 3. WebSite Schema
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'ملك التفاحه في مصر — أحمد عبد العزيز',
    description: 'استور أجهزة الآيفون والهواتف الأصلية بالسنبلاوين',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=='undefined'&&'serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(regs){for(var r of regs){r.unregister()}})}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased selection:bg-[#0071e3] selection:text-white flex flex-col justify-between">
        <MotionProvider>
          <Header />
          <main className="flex-1 w-full min-w-0">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
