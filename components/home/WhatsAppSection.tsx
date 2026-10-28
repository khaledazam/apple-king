import React from 'react';
import { MessageCircle, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function WhatsAppSection() {
  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود الاستفسار عن تفاصيل الأجهزة المتاحة وحجز موعد استلام من فروعكم.'
  )}`;

  return (
    <section className="py-20 bg-[#050505] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-900/20">
          <MessageCircle className="w-8 h-8" />
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            تواصل مباشرة مع فريق مبيعات <span className="gold-gradient-text">APPLE KING</span>
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            نسعد بخدمتكم وتوفير استشارات شراء دقيقة على مدار الساعة. تواصل معنا لمعرفة حالة التوافر، حجز جهاز،
            أو الاستفسار عن أسعار اليوم.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 pt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#D6AC63]" />
            <span>رد سريع خلال دقائق</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تأكيد فوري لحالة المخزون</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>تسليم واستلام بالفروع</span>
          </div>
        </div>

        <div className="pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            <span>ابدأ المحادثة عبر واتساب الآن</span>
          </a>
        </div>
      </div>
    </section>
  );
}
