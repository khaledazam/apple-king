import React from 'react';
import { MessageCircle, Clock, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function WhatsAppSection() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود التحدث مع أحد متخصصي المبيعات للاستفسار عن مواصفات الأجهزة وتأكيد التوافر في الفروع.'
  )}`;

  return (
    <section className="py-24 bg-[#000000] border-t border-white/[0.06] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <div className="w-16 h-16 rounded-full bg-[#161617] border border-white/[0.1] flex items-center justify-center text-[#f5f5f7] mx-auto shadow-xl">
          <UserCheck className="w-8 h-8 text-[#0071e3]" />
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-[#86868b] tracking-wider uppercase">
            خدمة استشارات الشراء
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#f5f5f7] tracking-tight">
            تسوّق مع أحد متخصصي Apple King
          </h2>
          <p className="text-sm text-[#86868b] leading-relaxed">
            هل تحتاج إلى مساعدة في اختيار السعة المناسبة أو مقارنة الموديلات؟ فريقنا المتخصص جاهز للإجابة عن جميع استفساراتك وتأكيد التوافر الفوري.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#86868b] pt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#0071e3]" />
            <span>رد سريع على استفساراتك</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تأكيد فوري للكميات بالمتاجر</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#86868b]" />
            <span>معاينة واستلام رسمي</span>
          </div>
        </div>

        <div className="pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-sm shadow-lg transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span>تحدث مع متخصص الآن عبر واتساب</span>
          </a>
        </div>
      </div>
    </section>
  );
}
