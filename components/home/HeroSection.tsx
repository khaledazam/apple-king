import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MessageCircle, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function HeroSection() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const heroWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود الاستفسار عن أحدث إصدارات آيفون الرائدة وتوافر الأجهزة في فروع APPLE KING.'
  )}`;

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#050505] pt-8 pb-16 lg:py-24">
      {/* Background Volumetric Gold Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 via-[#D6AC63]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Right Column (in RTL): Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-right">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#D6AC63]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D6AC63]" />
              <span className="text-xs font-bold tracking-widest text-[#F1D49A] uppercase font-mono">
                THE NEXT GENERATION
              </span>
            </div>

            {/* Main Headings */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-mono break-words">
                iPhone 18 <span className="gold-gradient-text">Pro Max</span>
              </h1>
              <p className="text-xl sm:text-3xl font-extrabold text-[#F1D49A]">
                قوة تتجاوز التوقعات
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              اكتشف تجربة استثنائية بتصميم فاخر وأداء متطور. استمتع بأعلى معايير الفخامة مع أحدث ما توصلت إليه تكنولوجيا الهواتف الذكية من آبل في فروعنا.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href={heroWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span>استفسر عبر واتساب</span>
              </a>

              <Link
                href="/products?productType=phone"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-[#D6AC63]/40 hover:border-[#D6AC63] text-[#F8F8F8] font-bold text-sm transition-all duration-300 hover:scale-[1.02]"
              >
                <span>استكشف الموبايلات المتاحة</span>
                <ArrowLeft className="w-4 h-4 text-[#D6AC63] flex-shrink-0" />
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-right">
              <div>
                <span className="block text-base sm:text-lg font-black text-white font-mono">100%</span>
                <span className="text-[10px] sm:text-xs text-neutral-400">أجهزة أصلية معتمدة</span>
              </div>
              <div>
                <span className="block text-base sm:text-lg font-black text-[#D6AC63] font-mono">فروعنا</span>
                <span className="text-[10px] sm:text-xs text-neutral-400">القاهرة والجيزة</span>
              </div>
              <div>
                <span className="block text-base sm:text-lg font-black text-white font-mono">فوري</span>
                <span className="text-[10px] sm:text-xs text-neutral-400">تسليم فوري ومباشر</span>
              </div>
            </div>
          </div>

          {/* Left Column (in RTL): Cinematic Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft Ambient Ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#D6AC63]/20 via-transparent to-transparent blur-2xl transform scale-95" />

            {/* Image Container with subtle floating border */}
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden gold-border-glow p-2 bg-[#0A0A0A]/80 shadow-2xl">
              <div className="relative aspect-[16/10] sm:aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950">
                <Image
                  src="/branding/iphone-18-hero.jpg"
                  alt="iPhone 18 Pro Max Conceptual Luxury Flagship"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>

              {/* Showcase Legend */}
              <div className="p-3.5 bg-neutral-900/90 rounded-b-2xl flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-300 font-medium">عرض تشويقي حصري</span>
                </div>
                <span className="text-[11px] text-[#D6AC63] font-mono">APPLE KING CONCEPT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-neutral-500 text-xs">
        <span>استكشف الكتالوج</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#D6AC63]" />
      </div>
    </section>
  );
}
