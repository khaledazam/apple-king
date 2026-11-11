'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ShieldCheck, Sparkles, ChevronDown, Smartphone, Repeat, CreditCard, MessageCircle } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

const faqs = [
  {
    q: 'كيف أعرف أحدث أسعار الآيفونات في السنبلاوين لدى ملك التفاحه؟',
    a: 'يمكنك استعراض أسعار أجهزة الآيفون المحدثة يوميًا عبر الاستور مباشرة في قسم الهواتف، أو التواصل السريع عبر واتساب مبيعات ملك التفاحه (01097976407) لتأكيد الأسعار وتوافر الألوان والسعات للأجهزة الجديدة والكسر زيرو.',
  },
  {
    q: 'أين يقع محل أحمد عبد العزيز (ملك التفاحه) في السنبلاوين ومواعيد العمل؟',
    a: 'يقع المتجر في مدينة السنبلاوين — شارع مصطفى كامل أمام بن بهاء. المتجر مفتوح يوميًا طوال أيام الأسبوع من الساعة 12:00 ظهرًا حتى الساعة 12:00 منتصف الليل (من 12 لـ 12) لاستقبالكم للمعاينة والتسليم الفوري.',
  },
  {
    q: 'هل يتوفر تقسيط واستبدال (تبديل) للآيفون لأهالي مركز السنبلاوين؟',
    a: 'نعم بالتأكيد. نوفر أنظمة تقسيط ميسرة ومتنوعة لأهالي مركز السنبلاوين، بالإضافة إلى خدمة الاستبدال الفوري (Trade-In) بأعلى تقييم لجهازك القديم كاش أو خصمه مباشرة من سعر جهازك الجديد.',
  },
  {
    q: 'ما هي حالة وضمان أجهزة الآيفون الكسر زيرو لدى أحمد عبد العزيز؟',
    a: 'جميع أجهزة الكسر زيرو تخضع لفحص فني معتمد يشمل 30 نقطة فحص (كفاءة البطارية، الشاشة الأصلية، الكاميرات، بصمة الوجه Face ID، والشبكة)، مع توفير فترة ضمان معتمدة وفاتورة رسمية لضمان حقك وراحتك التامة.',
  },
  {
    q: 'هل يخدم متجر ملك التفاحه قرى ومراكز محافظة الدقهلية المجاورة؟',
    a: 'نعم، يشرفنا خدمة أهالي مركز السنبلاوين بالكامل والقرى المجاورة (برهمتوش، شبراهور، الحجايزة، برقين، طنبارة، ميت غريطة، البوها، كفر الروك، ديو الوسطى) ومراكز تمي الأمديد، ديرب نجم، والمنصورة مع إمكانية الحجز المسبق قبل الزيارة.',
  },
];

const popularSearches = [
  { label: 'أسعار آيفون 16 بالسنبلاوين', href: '/products?productType=phone' },
  { label: 'آيفون كسر زيرو السنبلاوين', href: '/products?productType=phone' },
  { label: 'تقسيط موبايلات السنبلاوين', href: '/products?productType=phone' },
  { label: 'تبديل آيفون بالسنبلاوين', href: '/trade-in' },
  { label: 'أحمد عبد العزيز ملك التفاحه', href: '/' },
  { label: 'شارع مصطفى كامل السنبلاوين', href: '#location-hours' },
];

export function LocalSeoSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const whatsappUrl = `https://wa.me/${sanitizeWhatsAppNumber('201097976407')}?text=${encodeURIComponent('أهلًا ملك التفاحه (أحمد عبد العزيز)، عايز استفسر عن أحدث أسعار الآيفون المتاحة في فرع السنبلاوين.')}`;

  return (
    <section id="location-hours" className="w-full bg-[#fbfbfd] border-t border-black/[0.06] py-16 sm:py-24" aria-labelledby="seo-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06] text-xs font-semibold text-[#1d1d1f]">
            <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>السنبلاوين · شارع مصطفى كامل أمام بن بهاء</span>
          </div>

          <h2 id="seo-heading" className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] leading-snug">
            دليل أسعار الآيفون في السنبلاوين — ملك التفاحه
            <span className="block text-lg sm:text-2xl font-normal text-[#6e6e73] mt-2">
              بإدارة أحمد عبد العزيز — اختيارك الموثوق بمركز السنبلاوين والدقهلية
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
            الوجهة الأولى المعتمدة لأهالي مركز السنبلاوين لشراء واستبدال وصيانة هواتف آيفون الأصلية والكسر زيرو بأفضل أسعار كاش وبالتقسيط، مع فحص معتمد وضمان حقيقي.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm space-y-3 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-11 h-11 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1d1d1f]">
              أفضل أسعار الآيفون بالسنبلاوين
            </h3>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              تحديث لحظي لأسعار كافة إصدارات iPhone (16 Pro Max، 15 Pro، 14، 13، 12، 11) الجديدة والكسر زيرو مع عروض كاش لا تقبل المنافسة بالدقهلية.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm space-y-3 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1d1d1f]">
              مواعيد العمل: من 12 لـ 12
            </h3>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              مفتوح يوميًا من 12:00 ظهرًا حتى 12:00 منتصف الليل بمقرنا في السنبلاوين (شارع مصطفى كامل أمام بن بهاء) لتجربة ومعاينة جهازك بنفسك قبل الاستلام.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm space-y-3 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1d1d1f]">
              ثقة وضمان أحمد عبد العزيز
            </h3>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              فحص 30 نقطة معتمد للأجهزة الكسر زيرو، ضمان استبدال رسمي، وأعلى تقييم فوري كاش عند تبديل جهازك القديم بمركز السنبلاوين.
            </p>
          </div>
        </div>

        {/* Local Area Target Badge */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e6e73]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0071e3] shrink-0" />
            <span>
              <strong>نخدم باعتزاز أهالي مركز السنبلاوين وقراه:</strong> برهمتوش، شبراهور، الحجايزة، برقين، طنبارة، ميت غريطة، البوها، كفر الروك، ديو الوسطى، وكافة مراكز الدقهلية.
            </span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0071e3] text-white hover:bg-[#0077ed] font-medium transition-colors shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>تواصل مع أحمد عبد العزيز</span>
          </a>
        </div>

        {/* Interactive FAQ Block for Rich SEO */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider">
              الأسئلة الأكثر بحثًا في السنبلاوين
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
              كل ما يهمك حول أسعار وشراء وصيانة الآيفون
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-right font-medium text-sm sm:text-base text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[#6e6e73] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0071e3]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#6e6e73] leading-relaxed border-t border-black/[0.03]">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Local Keyword Quick-Links */}
        <div className="pt-4 border-t border-black/[0.06] text-center space-y-3">
          <span className="text-xs text-[#86868b]">عمليات البحث الشائعة بالسنبلاوين:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularSearches.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-black/[0.04] border border-black/[0.08] text-[#1d1d1f] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
