import React from 'react';
import Link from 'next/link';
import { Store, MessageCircle } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export default function NotFound() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، لم أتمكن من العثور على المنتج المطلوب في متجركم وأود الاستفسار عن توفره.'
  )}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center bg-[#f5f5f7]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-white border border-black/[0.08] flex items-center justify-center text-[#1d1d1f] mx-auto shadow-xl">
          <Store className="w-8 h-8 text-[#0071e3]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#6e6e73] font-mono tracking-wider uppercase">
            404 NOT FOUND
          </span>
          <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">الصفحة أو الموديل غير متوفر</h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
            عذراً، قد يكون الرابط خاطئاً أو تم تحديث قائمة المنتجات المعروضة في الكتالوج.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>تصفح الكتالوج المتاح</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] border border-black/[0.08] text-[#1d1d1f] font-medium text-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>استفسر عبر واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
