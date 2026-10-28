import React from 'react';
import { ShieldCheck, Sparkles, MapPin, MessageSquare } from 'lucide-react';

export function ValueProposition() {
  const values = [
    {
      icon: ShieldCheck,
      title: 'أجهزة أصلية معتمدة',
      desc: 'فحص فني دقيق لكل جهاز جديد أو مستعمل مع ضمان معتمد وشفافية تامة.',
    },
    {
      icon: MapPin,
      title: 'استلام فوري من المتاجر',
      desc: 'فروع في القاهرة والجيزة لمعاينة جهازك واختباره واستلامه في نفس اليوم.',
    },
    {
      icon: Sparkles,
      title: 'أسعار كاش محدثة',
      desc: 'تحديث فوري لأسعار السوق بالجنيه المصري دون أي تكاليف أو رسوم إضافية.',
    },
    {
      icon: MessageSquare,
      title: 'خدمة المتخصصين',
      desc: 'تواصل مباشر مع فريق مبيعات Apple King لاختيار الموديل والمواصفات الأنسب.',
    },
  ];

  return (
    <section className="py-16 border-y border-white/[0.06] bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-[22px] bg-[#161617] border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1d1d1f] flex items-center justify-center border border-white/[0.06]">
                  <Icon className="w-5 h-5 text-[#f5f5f7]" />
                </div>
                <h3 className="text-base font-semibold text-[#f5f5f7] tracking-tight">{v.title}</h3>
                <p className="text-xs text-[#86868b] leading-relaxed font-normal">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
