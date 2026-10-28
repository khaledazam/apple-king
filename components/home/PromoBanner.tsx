import React from 'react';
import Link from 'next/link';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function PromoBanner() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const promoWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود الاستفسار عن عروض الاستبدال والأسعار الخاصة المتاحة حاليًا في APPLE KING.'
  )}`;

  return (
    <section className="py-16 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] overflow-hidden bg-[#161617] border border-white/[0.08] p-8 sm:p-14">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#86868b] tracking-wider uppercase">
                Apple King Trade In • برامج التبديل
              </span>

              <h2 className="text-2xl sm:text-4xl font-semibold text-[#f5f5f7] tracking-tight leading-tight">
                استبدل هاتفك الحالي واحصل على رصيد مباشر لشراء أحدث الأجهزة.
              </h2>

              <p className="text-sm text-[#86868b] leading-relaxed max-w-xl">
                تقييم فوري وعادل لهاتفك القديم مع إمكانية استلام جهازك الجديد في نفس اللحظة عبر فروعنا المعتمدة.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 flex-shrink-0 w-full sm:w-auto">
              <a
                href={promoWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>احسب قيمة هاتفك</span>
              </a>

              <Link
                href="/products?featured=true"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-5 py-3 rounded-full bg-[#1d1d1f] hover:bg-[#2d2d2f] border border-white/[0.08] text-[#f5f5f7] text-xs font-normal transition-colors"
              >
                <span>تصفح العروض المميزة</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
