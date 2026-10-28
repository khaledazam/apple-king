import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function HeroSection() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const heroWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود الاستفسار عن أحدث إصدارات آيفون وتوافر الأجهزة في فروع APPLE KING.'
  )}`;

  return (
    <section className="relative w-full bg-[#000000] text-center pt-14 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Apple Headline Typography Stack */}
        <div className="space-y-3">
          <p className="text-sm md:text-base font-semibold tracking-tight text-[#f5f5f7]">
            iPhone 16 Pro
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#f5f5f7]">
            قمة القوة. غاية الأناقة.
          </h1>
          <p className="text-lg md:text-2xl text-[#86868b] max-w-2xl mx-auto font-normal">
            تصميم التيتانيوم فائق المتانة، شريحة A18 Pro الجبارة، ونظام كاميرات احترافي.
          </p>
          <p className="text-sm md:text-base text-[#86868b]">
            متوفر الآن للتسليم الفوري في فروعنا • يبدأ من ٥٢,٠٠٠ ج.م
          </p>
        </div>

        {/* Apple Action CTAs: Blue Pill & Chevron Link */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={heroWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-btn-primary px-5 py-2.5 text-sm font-medium gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>استفسر عبر واتساب</span>
          </a>

          <Link
            href="/products?productType=phone"
            className="apple-link text-sm font-medium"
          >
            <span>استكشف الموبايلات المتاحة</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Cinematic Device Showcase */}
        <div className="relative w-full max-w-4xl mx-auto pt-6">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-[28px] overflow-hidden bg-[#000000] flex items-center justify-center">
            <Image
              src="/branding/iphone-18-hero.jpg"
              alt="Apple iPhone 18 Pro Flagship Showcase"
              fill
              priority
              className="object-contain object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>

        {/* Apple Three-Column Highlights */}
        <div className="pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
          <div>
            <span className="block text-xl md:text-2xl font-semibold text-[#f5f5f7]">100%</span>
            <span className="text-xs text-[#86868b]">أجهزة أصلية معتمدة</span>
          </div>
          <div>
            <span className="block text-xl md:text-2xl font-semibold text-[#f5f5f7]">فروعنا</span>
            <span className="text-xs text-[#86868b]">القاهرة والجيزة</span>
          </div>
          <div>
            <span className="block text-xl md:text-2xl font-semibold text-[#f5f5f7]">فوري</span>
            <span className="text-xs text-[#86868b]">تسليم ومعاينة بالفرع</span>
          </div>
        </div>
      </div>
    </section>
  );
}
