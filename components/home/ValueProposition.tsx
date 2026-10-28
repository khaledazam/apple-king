import React from 'react';
import { ShieldCheck, Sparkles, MapPin, MessageCircle } from 'lucide-react';

export function ValueProposition() {
  const values = [
    {
      icon: ShieldCheck,
      title: 'منتجات أصلية 100%',
      desc: 'أجهزة وإكسسوارات جديدة ومستعملة بحالة المصنع مع فحص دقيق لكل جهاز.',
      color: 'text-emerald-400',
    },
    {
      icon: Sparkles,
      title: 'أسعار معتمدة ومنافسة',
      desc: 'تحديث فوري لأسعار السوق بالجنيه المصري دون أي رسوم أو عمولات خفية.',
      color: 'text-[#D6AC63]',
    },
    {
      icon: MapPin,
      title: 'فروع متعددة للتسليم',
      desc: 'فروع في القاهرة والجيزة لمعاينة واستلام جهازك فوراً بكل أمان.',
      color: 'text-blue-400',
    },
    {
      icon: MessageCircle,
      title: 'دعم مباشر عبر واتساب',
      desc: 'فريق مبيعات متخصص للإجابة على جميع استفساراتك وحجز الأجهزة المتاحة.',
      color: 'text-teal-400',
    },
  ];

  return (
    <section className="py-12 border-y border-neutral-900 bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#121212] border border-neutral-800/80 hover:border-neutral-700 transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
                  <Icon className={`w-5 h-5 ${v.color}`} />
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">{v.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
