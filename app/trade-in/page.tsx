import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { TradeInWizard } from '@/components/trade-in/TradeInWizard';
import { Sparkles, ShieldCheck, Repeat, ArrowRight, Store, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'تاخدوا جهازي بكام؟ | تسعير فوري بالذكاء الاصطناعي — ملك التفاحه (السنبلاوين)',
  description:
    'احسب سعر بيع أو استبدال هاتفك الآيفون أو السامسونج بالذكاء الاصطناعي استناداً لأسعار السوق ودوبيزل في مصر مع ملك التفاحه (أحمد عبد العزيز) بالسنبلاوين.',
  keywords: [
    'تاخدوا جهازي بكام',
    'تسعير الايفون المستعمل',
    'تبديل ايفون السنبلاوين',
    'بيع ايفون كاش السنبلاوين',
    'اسعار دوبيزل للايفون',
    'ملك التفاحه احمد عبد العزيز',
  ],
};

export default function TradeInPage() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Intro Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto" dir="rtl">
          <div className="flex items-center justify-center gap-2 text-xs text-[#6e6e73]">
            <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#1d1d1f] transition-colors">
              الاستور
            </Link>
            <span>/</span>
            <span className="text-[#1d1d1f] font-medium">تاخدوا جهازي بكام؟</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
            تاخدوا جهازي بكام؟ 🤖
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
            بدل ما تلف على المحلات وتفاصل؛ حدّد مواصفات هاتفك الحالي وسيقوم الذكاء الاصطناعي بحساب سعره السوقي العادل على دوبيزل وتقدير قيمة البيع أو الاستبدال فورياً.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[#424245]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e5e5ea] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d8b66b]" />
              <span>تحليل أسعار السوق ودوبيزل</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e5e5ea] shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#d8b66b]" />
              <span>فرع السنبلاوين (أحمد عبد العزيز)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e5e5ea] shadow-sm">
              <Repeat className="w-3.5 h-3.5 text-[#d8b66b]" />
              <span>بيع كاش أو ترقية لهاتف أحدث</span>
            </span>
          </div>
        </div>

        {/* The Interactive AI Wizard */}
        <TradeInWizard />

        {/* Reassurance Footer */}
        <div className="rounded-2xl bg-white border border-[#e5e5ea] p-6 text-center text-xs text-[#6e6e73] max-w-3xl mx-auto space-y-2" dir="rtl">
          <p className="font-semibold text-[#1d1d1f]">
            حابب تبيع جهازك أو تستبدله بجهاز كسر زيرو أو جديد؟
          </p>
          <p>
            شرّفنا في مقر فرع <strong>ملك التفاحه (أحمد عبد العزيز) بالسنبلاوين</strong> لمعاينة جهازك وفحصه فحصاً فنياً معتمداً واستلام المبلغ كاش أو خصمه من ثمن جهازك الجديد فورياً.
          </p>
        </div>
      </div>
    </div>
  );
}
