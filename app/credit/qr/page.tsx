import React from 'react';
import { Metadata } from 'next';
import QRCode from 'qrcode';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Printer, ArrowRight, ShieldCheck, Lock, AlertTriangle, ExternalLink } from 'lucide-react';
import { PrintButton } from './PrintButton';

export const metadata: Metadata = {
  title: 'لافتة الـ QR المعتمدة للتقسيط بالفرع | ملك التفاحه السنبلاوين',
  description: 'لافتة رسمية قابلة للطباعة تتضمن كود الاستجابة السريعة (QR) لبوابة تقسيط وائتمان هواتف فرع السنبلاوين.',
};

export default async function CreditQrPosterPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king-gamma.vercel.app';
  const targetCreditUrl = `${baseUrl}/credit`;

  // Generate crisp SVG or high-res DataURL
  const qrDataUrl = await QRCode.toDataURL(targetCreditUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: '#0a192f',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });

  return (
    <div className="min-h-screen bg-[#070d19] py-8 sm:py-12 px-4 font-sans text-slate-100 flex flex-col items-center justify-center" dir="rtl">
      
      {/* Non-print action header */}
      <div className="w-full max-w-xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/credit"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع لبوابة التقسيط</span>
        </Link>

        <div className="flex items-center gap-2">
          <PrintButton />
          <a
            href={targetCreditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 text-xs transition-colors"
          >
            <span>فتح الرابط مباشرة</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── Printable Luxury Counter Stand / Poster ── */}
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-slate-950 text-center space-y-6 relative overflow-hidden print:border-4 print:shadow-none print:m-0 print:p-8">
        
        {/* Frame / Header */}
        <div className="border-b-2 border-slate-900 pb-5 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold font-mono tracking-widest uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>CONSUMER CREDIT SYSTEM</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            منظومة تقسيط الهواتف المعتمدة
          </h1>

          <p className="text-xs sm:text-sm font-bold text-blue-900">
            متجر ملك التفاحه — فرع السنبلاوين (شارع مصطفى كامل أمام بن بهاء)
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">
            عزيزي العميل: برجاء مسح الـ QR Code بكاميرا هاتفك
          </p>
          <p className="text-xs text-slate-600">
            للدخول على منظومة الائتمان وحساب خطة القسط المعتمدة واستخراج كود الموافقة
          </p>
        </div>

        {/* Large Crisp QR Code */}
        <div className="relative inline-block p-4 bg-white border-4 border-slate-950 rounded-3xl shadow-md">
          <Image
            src={qrDataUrl}
            alt="Scan QR for Credit Portal"
            width={260}
            height={260}
            priority
            className="rounded-xl mx-auto"
          />
          <div className="mt-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            SCAN WITH CAMERA • VERIFIED BRANCH LINK
          </div>
        </div>

        {/* 4 Process Steps */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-[11px] font-bold text-slate-800 pt-2 border-t border-slate-200">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-blue-600 font-mono text-xs">01</span>
            مسح الكود
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-blue-600 font-mono text-xs">02</span>
            اختيار الجهاز
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-blue-600 font-mono text-xs">03</span>
            حساب القسط
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-blue-600 font-mono text-xs">04</span>
            كود الاعتماد
          </div>
        </div>

        {/* Official Non-negotiable Notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-[11px] text-amber-900 font-semibold leading-relaxed text-right flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>تنبيه نظامي:</strong> حساب الأقساط ونسب التمويل مبرمجة إلكترونيًا طبقًا للمنظومة المركزية؛ ولا يملك موظف الفرع أي صلاحية لتعديل الأقساط أو قبول استثناءات يدوية.
          </div>
        </div>

        {/* Footer Authority */}
        <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-200">
          <span>BRANCH: SENBELLAWEIN • SECURE</span>
          <span>APPLE KING SYSTEM</span>
        </div>

      </div>

      <div className="mt-6 text-xs text-slate-500 print:hidden text-center">
        💡 يمكنك الضغط على <strong>«طباعة اللافتة»</strong> ووضعها في استاند أكريليك على مكتب المبيعات بالفرع.
      </div>
    </div>
  );
}
