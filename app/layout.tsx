import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'APPLE KING | متجر الهواتف والإكسسوارات الفاخرة',
    template: '%s | APPLE KING',
  },
  description:
    'متجر APPLE KING الرسمي للهواتف الذكية والإكسسوارات الأصلية في مصر. أحدث هواتف آيفون وسامسونج بأفضل أسعار كاش وتسليم فوري من فروعنا.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://store.mobilix.eg'),
  icons: {
    icon: '/branding/crown-icon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'APPLE KING | متجر الهواتف والإكسسوارات الفاخرة',
    description: 'أحدث هواتف آيفون وسامسونج بأفضل أسعار كاش وتسليم فوري من فروعنا.',
    locale: 'ar_EG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen bg-[#000000] text-[#f5f5f7] antialiased selection:bg-[#0071e3] selection:text-white flex flex-col justify-between">
        <Header />
        <main className="flex-1 w-full min-w-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
