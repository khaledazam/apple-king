import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function PromoBanner() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const promoWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود الاستفسار عن العروض المميزة المتوفرة حاليًا في APPLE KING.'
  )}`;

  return (
    <section className="py-12 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-950 via-[#14120B] to-neutral-950 border border-[#D6AC63]/40 p-8 sm:p-12 shadow-2xl">
          {/* Subtle Ambient Gold Radiance */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-right max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6AC63]/10 border border-[#D6AC63]/30 text-xs font-bold text-[#F1D49A]">
                <Sparkles className="w-3.5 h-3.5 text-[#D6AC63]" />
                <span>عروض وأسعار خاصة لعملاء المتجر</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                اختر هاتفك الرائد القادم بأفضل سعر كاش في مصر
              </h2>

              <p className="text-sm text-neutral-300 leading-relaxed">
                استمتع بأسعار منافسة على أحدث أجهزة آبل وسامسونج الأصلية مع خيارات تبديل الأجهزة المستعملة
                وتأكيد فوري للتوافر عبر فروعنا.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
              <a
                href={promoWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>استفسر عن عروض اليوم</span>
              </a>

              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold transition-colors"
              >
                <span>تصفح المنتجات المميزة</span>
                <ArrowLeft className="w-4 h-4 text-[#D6AC63]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
