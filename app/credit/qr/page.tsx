import React from 'react';
import { Metadata } from 'next';
import QRCode from 'qrcode';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, ArrowRight, ShieldCheck, AlertCircle, ExternalLink, Smartphone, Check } from 'lucide-react';
import { PrintButton } from './PrintButton';

export const metadata: Metadata = {
  title: 'لافتة كود الـ QR الرسمية بالفرع | بوابة التقسيط والتمويل المعتمد',
  description: 'لافتة كاونتر رسمية معتمدة قابلة للطباعة تتضمن كود الاستجابة السريعة (QR) لبوابة تقسيط الهواتف لفرع السنبلاوين.',
};

export default async function CreditQrPosterPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king-gamma.vercel.app';
  const targetCreditUrl = `${baseUrl}/credit`;

  // Generate ultra crisp, high-contrast QR code
  const qrDataUrl = await QRCode.toDataURL(targetCreditUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4 font-sans text-slate-800 flex flex-col items-center justify-center print:bg-white print:p-0" dir="rtl">
      
      {/* Top Screen Control Bar (Hidden when printed) */}
      <div className="w-full max-w-xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/credit"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <span>فتح الرابط</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>

      {/* ── Official Institutional Counter Stand (Printable) ── */}
      <div className="w-full max-w-xl bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-lg border-2 border-slate-900 text-center space-y-6 relative overflow-hidden print:border-2 print:border-slate-900 print:shadow-none print:m-0 print:p-6 print:rounded-none">
        
        {/* Institutional Header Strip */}
        <div className="border-b-2 border-slate-900 pb-5 space-y-2">
          
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                CONSUMER CREDIT & FINANCING GATEWAY
              </div>
              <div className="text-sm font-black text-slate-900">
                المنظومة الإلكترونية الموحدة لتقسيط الهواتف
              </div>
            </div>
          </div>

          {/* Official Bank Partners Strip — Logos */}
          <div className="inline-flex items-center justify-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300">
            <span className="text-[10px] font-bold text-slate-500 pl-2 border-l border-slate-300 hidden sm:inline">
              الربط المصرفي:
            </span>
            <div className="flex items-center gap-3">
              <img src="/branding/banks/nbe.svg" alt="البنك الأهلي المصري" className="h-4.5 sm:h-5 w-auto object-contain" />
              <img src="/branding/banks/banque-misr.svg" alt="بنك مصر" className="h-4.5 sm:h-5 w-auto object-contain" />
              <img src="/branding/banks/cib.svg" alt="CIB" className="h-4 sm:h-4.5 w-auto object-contain" />
              <img src="/branding/banks/qnb.svg" alt="QNB" className="h-4 sm:h-4.5 w-auto object-contain" />
              <img src="/branding/banks/adib.svg" alt="ADIB" className="h-4 sm:h-4.5 w-auto object-contain" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 pt-2 tracking-tight">
            بوابة تقسيط الأجهزة بالفرع
          </h1>

          <p className="text-xs font-bold text-blue-900">
            فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء (مواعيد العمل: من 12:00 ظهرًا حتى 12:00 منتصف الليل)
          </p>
        </div>

        {/* Clear Instructions */}
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-900">
            عزيزي العميل: برجاء مسح رمز QR بكاميرا هاتفك
          </p>
          <p className="text-xs text-slate-600">
            لاختيار جهازك من المخزون وحساب الأقساط الشهرية واستخراج كود الاعتماد الرسمي
          </p>
        </div>

        {/* Crisp High-Contrast QR Code */}
        <div className="inline-block p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-xs">
          <Image
            src={qrDataUrl}
            alt="Scan QR for Credit Portal"
            width={240}
            height={240}
            priority
            className="rounded mx-auto"
          />
          <div className="mt-2 text-[10px] font-mono font-bold text-slate-700 tracking-wider">
            POINT CAMERA • BRANCH VERIFIED (SEN-01)
          </div>
        </div>

        {/* 5-Step Procedural Workflow */}
        <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold text-slate-800 pt-2 border-t border-slate-200">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="block text-blue-700 font-mono text-xs">01</span>
            مسح الرمز
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="block text-blue-700 font-mono text-xs">02</span>
            اختيار الجهاز
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="block text-blue-700 font-mono text-xs">03</span>
            تحديد المدة
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="block text-blue-700 font-mono text-xs">04</span>
            كود الاعتماد
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="block text-blue-700 font-mono text-xs">05</span>
            الاستلام
          </div>
        </div>

        {/* Legal Regulatory Notice */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-700 font-medium leading-relaxed text-right flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>تنبيه إداري ملزم:</strong> خطط الأقساط ونسب الفائدة مبرمجة إلكترونيًا عبر المنظومة المركزية ولا تقبل أي تفاوض يدوي أو تعديل داخل الفرع.
          </div>
        </div>

        {/* Footer Identifier */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>PORTAL: EG-DK-SEN-01</span>
          <span>APPLE KING — SENBELLAWEIN</span>
        </div>

      </div>

    </div>
  );
}
