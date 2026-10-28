import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Store, MessageCircle } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export default function NotFound() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، لم أتمكن من العثور على المنتج المطلوب في متجركم وأود الاستفسار عن توفره.'
  )}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D6AC63] mx-auto shadow-xl">
          <Store className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#D6AC63] font-mono tracking-widest uppercase">
            404 NOT FOUND
          </span>
          <h1 className="text-3xl font-black text-white">المنتج أو الصفحة غير متوفرة</h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            عذراً، قد يكون الرابط خاطئاً أو تم إلغاء نشر المنتج من الكتالوج العام.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>تصفح الكتالوج المتاح</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-[#F1D49A] hover:bg-neutral-800 font-bold text-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>اسأل المبيعات عبر واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
