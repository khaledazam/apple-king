import React from 'react';
import { Metadata } from 'next';
import QRCode from 'qrcode';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Printer, ArrowRight, ShieldCheck, Lock, AlertTriangle, ExternalLink, Smartphone, Check, Sparkles } from 'lucide-react';
import { PrintButton } from './PrintButton';

export const metadata: Metadata = {
  title: 'لافتة الـ QR المعتمدة للتقسيط بالفرع | ملك التفاحه السنبلاوين',
  description: 'لافتة رسمية معتمدة قابلة للطباعة تتضمن كود الاستجابة السريعة (QR) لبوابة تمويل وتقسيط الهواتف.',
};

export default async function CreditQrPosterPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king-gamma.vercel.app';
  const targetCreditUrl = `${baseUrl}/credit`;

  // Generate ultra high-res crisp QR Code
  const qrDataUrl = await QRCode.toDataURL(targetCreditUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: '#060b18',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });

  return (
    <div className="min-h-screen bg-[#060b18] py-8 sm:py-12 px-4 font-sans text-slate-100 flex flex-col items-center justify-center relative overflow-hidden" dir="rtl">
      
      {/* Golden Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Screen Control Bar (Hidden on Print) */}
      <div className="w-full max-w-xl mx-auto mb-6 flex items-center justify-between print:hidden relative z-10">
        <Link
          href="/credit"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع لبوابة التقسيط</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <PrintButton />
          <a
            href={targetCreditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-medium transition-colors"
          >
            <span>فتح الرابط بالمتصفح</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── Printable Luxury Counter Stand Poster (Matching Image Design) ── */}
      <div className="w-full max-w-xl bg-gradient-to-b from-[#0b162c] to-[#060b18] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-amber-400 text-center space-y-6 relative overflow-hidden print:border-4 print:shadow-none print:m-0 print:p-8 print:text-slate-900 print:bg-white">
        
        {/* Top Header with Phone Logo */}
        <div className="border-b-2 border-amber-400/40 pb-5 space-y-2">
          
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-white print:text-slate-950 font-mono uppercase tracking-wider">
                Consumer Credit & Installment Portal
              </div>
              <div className="text-[10px] text-amber-400 font-bold">
                بوابة التمويل الاستهلاكي والتقسيط — ملك التفاحه
              </div>
            </div>
          </div>

          {/* Partner Banks Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/40 text-[10px] text-amber-300 print:bg-slate-100 print:text-slate-800">
            <span>بالتعاون مع شركائنا من البنوك (الأهلي • مصر • CIB • QNB • أبوظبي الإسلامي)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white print:text-slate-950 pt-2 tracking-tight">
            امتلك هاتفك الآن بالتقسيط المريح
          </h1>

          <p className="text-xs font-bold text-amber-400 print:text-blue-900">
            فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء (مواعيد العمل: من 12 لـ 12)
          </p>
        </div>

        {/* QR Instructions */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-white print:text-slate-950">
            عزيزي العميل: برجاء مسح رمز QR بكاميرا هاتفك
          </p>
          <p className="text-xs text-slate-300 print:text-slate-600">
            لاختيار جهازك من المخزون وحساب خطة القسط واستخراج كود الاعتماد المعتمد
          </p>
        </div>

        {/* Large Crisp QR Code with Golden Frame */}
        <div className="relative inline-block p-4 bg-white border-4 border-amber-400 rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.25)]">
          <Image
            src={qrDataUrl}
            alt="Scan QR for Credit Portal"
            width={240}
            height={240}
            priority
            className="rounded-xl mx-auto"
          />
          <div className="mt-2 text-[10px] font-mono font-bold text-slate-900 uppercase tracking-widest">
            SCAN WITH CAMERA • VERIFIED BRANCH
          </div>
        </div>

        {/* 5 Process Steps */}
        <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] sm:text-[10px] font-bold text-slate-200 print:text-slate-800 pt-2 border-t border-white/10 print:border-slate-300">
          <div className="p-1.5 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
            <span className="block text-amber-400 font-mono text-xs">01</span>
            مسح QR
          </div>
          <div className="p-1.5 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
            <span className="block text-amber-400 font-mono text-xs">02</span>
            اختر هاتفك
          </div>
          <div className="p-1.5 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
            <span className="block text-amber-400 font-mono text-xs">03</span>
            بيانات الطلب
          </div>
          <div className="p-1.5 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
            <span className="block text-amber-400 font-mono text-xs">04</span>
            الموافقة
          </div>
          <div className="p-1.5 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
            <span className="block text-amber-400 font-mono text-xs">05</span>
            استلام الجهاز
          </div>
        </div>

        {/* Non-negotiable Notice */}
        <div className="bg-amber-500/10 border border-amber-400/40 rounded-2xl p-3 text-[11px] text-amber-200 print:text-amber-900 print:bg-amber-50 font-medium leading-relaxed text-right flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>تنبيه نظامي ملزم:</strong> خطط الأقساط ونسب التمويل مبرمجة إلكترونيًا عبر المنظومة المركزية ولا تقبل أي تفاوض يدوي أو تعديل بالفرع.
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-white/10 print:border-slate-300">
          <span>BRANCH: SENBELLAWEIN • 256-BIT SSL</span>
          <span>APPLE KING CONSUMER FINANCE</span>
        </div>

      </div>

      <div className="mt-6 text-xs text-slate-400 print:hidden text-center">
        💡 اضغط على <strong>«طباعة اللافتة للمكتب»</strong> لطباعتها ووضعها في استاند أكريليك على مكتب المبيعات بالفرع.
      </div>
    </div>
  );
}
