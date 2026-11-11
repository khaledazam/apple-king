import { MotionProvider } from '@/components/ui/MotionPrimitives';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king-gamma.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'ملك التفاحه | أحمد عبد العزيز — متجر الآيفون والهواتف الأصلية بالسنبلاوين',
    template: '%s | ملك التفاحه - أحمد عبد العزيز',
  },
  description:
    'متجر ملك التفاحه بإدارة أحمد عبد العزيز في السنبلاوين، الدقهلية. الوجهة المعتمدة الأولى لأحدث أجهزة آيفون (iPhone) وسامسونج الأصلية كاش وبأنظمة تقسيط ميسرة، أجهزة كسر زيرو بضمان معتمد، وإكسسوارات أصلية.',
  keywords: [
    'ملك التفاحه',
    'ملك التفاحه السنبلاوين',
    'ملك التفاحه في مصر',
    'أحمد عبد العزيز ملك التفاحه',
    'احمد عبد العزيز السنبلاوين',
    'احمد عبدالعزيز',
    'ايفون السنبلاوين',
    'ايفون',
    'آيفون',
    'iPhone',
    'ايفونات السنبلاوين',
    'محل ايفون السنبلاوين',
    'محلات موبايل السنبلاوين',
    'اسعار الايفون في السنبلاوين',
    'اسعار الايفون في مصر',
    'موبايلات السنبلاوين',
    'سامسونج السنبلاوين',
    'تقسيط موبايلات السنبلاوين',
    'صيانة ايفون السنبلاوين',
    'ايفون مستعمل السنبلاوين',
    'Apple King',
    'Apple King Egypt',
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
    title: 'ملك التفاحه | أحمد عبد العزيز — متجر الآيفون والهواتف الأصلية بالسنبلاوين',
    description:
      'تسوق أحدث هواتف آيفون وسامسونج وإكسسوارات أصلية بأفضل أسعار في السنبلاوين ومحافظة الدقهلية. كاش وتقسيط وتسليم فوري من فروعنا.',
    url: BASE_URL,
    siteName: 'ملك التفاحه في مصر — أحمد عبد العزيز',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ملك التفاحه | أحمد عبد العزيز — السنبلاوين',
    description: 'أقوى عروض الآيفون والهواتف الذكية في السنبلاوين. كاش وتقسيط وضمان معتمد.',
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
  other: {
    'geo.region': 'EG-DK',
    'geo.placename': 'السنبلاوين، الدقهلية',
    'geo.position': '30.8525;31.4647',
    'ICBM': '30.8525, 31.4647',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ElectronicsStore',
  '@id': `${BASE_URL}/#store`,
  name: 'ملك التفاحه — أحمد عبد العزيز (Apple King)',
  alternateName: [
    'ملك التفاحه',
    'ملك التفاحه في مصر',
    'أحمد عبد العزيز ملك التفاحه',
    'محل ملك التفاحه السنبلاوين',
    'Apple King',
  ],
  description:
    'متجر ملك التفاحه بإدارة أحمد عبد العزيز بالسنبلاوين، محافظة الدقهلية. متخصصون في بيع وشراء وصيانة واستبدال هواتف آيفون وسامسونج الأصلية، كاش وبالتقسيط.',
  url: BASE_URL,
  telephone: '+201000000000',
  priceRange: '$$$',
  currenciesAccepted: 'EGP',
  paymentAccepted: 'Cash, Credit Card, Installments',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'السنبلاوين شارع مصطفي كامل امام بن بهاء',
    addressLocality: 'السنبلاوين',
    addressRegion: 'الدقهلية',
    addressCountry: 'EG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 30.8525,
    longitude: 31.4647,
  },
  areaServed: [
    { '@type': 'City', name: 'السنبلاوين' },
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
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
