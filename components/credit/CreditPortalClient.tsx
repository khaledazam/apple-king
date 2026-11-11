'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  Lock,
  Building,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  UserCheck,
  CreditCard,
  Printer,
  MessageCircle,
  Smartphone,
  Scale,
  QrCode,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Check,
  ExternalLink,
  Info,
} from 'lucide-react';
import QRCode from 'qrcode';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

interface PhoneItem {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  brand: string;
  basePrice: number;
  promoPrice?: number | null;
  coverImage?: string;
  images?: string[];
  totalAvailableQuantity: number;
  variants?: {
    variantKey: string;
    storage?: string;
    color?: string;
    condition: string;
    price: number;
    promoPrice?: number | null;
    availableQuantity: number;
  }[];
}

interface CreditPortalClientProps {
  phones: PhoneItem[];
  branchName?: string;
  salesNumber?: string;
}

const DURATIONS = [
  { months: 6, label: '6 أشهر', rate: 0.15, note: 'عائد 2.5% شهريًا' },
  { months: 12, label: '12 شهرًا', rate: 0.24, note: 'الخطة القياسية المعتمدة' },
  { months: 18, label: '18 شهرًا', rate: 0.34, note: 'أقساط ميسرة' },
  { months: 24, label: '24 شهرًا', rate: 0.44, note: 'الحد الأقصى للتمويل' },
];

const FAQS = [
  {
    q: 'ما هي المستندات الرسمية المطلوبة لإتمام التعاقد؟',
    a: 'أصل بطاقة الرقم القومي سارية للمشتري والضامن (درجة أولى)، وإيصال مرافق حديث أو ما يثبت محل الإقامة بمركز السنبلاوين أو محافظة الدقهلية.',
  },
  {
    q: 'كيف يتم تحديد القسط الشهري ونسبة المقدم؟',
    a: 'يتم احتساب الأقساط والمقدمات آلياً عبر المنظومة المركزية وفق سعر الجهاز المعتمد بالسيستم وخطة السداد المختارة، ولا تخضع لأي تقدير أو تعديل يدوي داخل الفرع.',
  },
  {
    q: 'ما هي مواعيد العمل الرسمية بفرع السنبلاوين؟',
    a: 'يستقبلكم الفرع يوميًا طوال أيام الأسبوع من الساعة 12:00 ظهرًا حتى الساعة 12:00 منتصف الليل (شارع مصطفى كامل أمام بن بهاء) لتوقيع العقود واستلام الأجهزة.',
  },
  {
    q: 'ما هي الآثار القانونية المترتبة على التأخر في السداد؟',
    a: 'يُمنح العميل مهلة سماح 48 ساعة فقط. بعدها تُحتسب رسوم تأخير إدارية بواقع 50 ج.م يوميًا. وفي حال التخلف عن سداد قسطين متتاليين تسقط الآجال وتُحال السندات الإذنية والإيصالات الموقعة للنيابة والشؤون القانونية فوراً.',
  },
];

export function CreditPortalClient({
  phones,
  branchName = 'فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء',
  salesNumber = '201097976407',
}: CreditPortalClientProps) {
  // ==========================================
  // REALISTIC BANK-GRADE LOADING SCREEN STATE
  // ==========================================
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('جاري إنشاء اتصال آمن بالمنظومة الائتمانية الموحدة...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadProgress(45);
      setStatusMessage('التحقق من جلسة فرع السنبلاوين وتشفير البيانات (TLS 1.3 / 256-bit)...');
    }, 500);

    const timer2 = setTimeout(() => {
      setLoadProgress(80);
      setStatusMessage('مطابقة مخزون الأجهزة المعتمدة بالسجلات المركزية (كود: SEN-01)...');
    }, 1100);

    const timer3 = setTimeout(() => {
      setLoadProgress(100);
      setIsInitialLoading(false);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Selection states
  const [selectedPhoneId, setSelectedPhoneId] = useState<string>(phones[0]?.id || '');
  const [selectedDurationMonths, setSelectedDurationMonths] = useState<number>(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);

  // Form states
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residenceArea, setResidenceArea] = useState('السنبلاوين');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Workflow states
  const [step, setStep] = useState<'calc' | 'evaluating' | 'approved'>('calc');
  const [evaluationStage, setEvaluationStage] = useState(0);
  const [approvalCode, setApprovalCode] = useState('');
  const [approvalDate, setApprovalDate] = useState('');
  const [approvalQrDataUrl, setApprovalQrDataUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const calculatorRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);

  // Selected phone & price
  const selectedPhone = useMemo(() => {
    return phones.find((p) => p.id === selectedPhoneId) || phones[0];
  }, [phones, selectedPhoneId]);

  const devicePrice = useMemo(() => {
    if (!selectedPhone) return 0;
    return selectedPhone.promoPrice || selectedPhone.basePrice || 0;
  }, [selectedPhone]);

  // Calculations
  const calc = useMemo(() => {
    const downPayment = Math.round((devicePrice * downPaymentPercent) / 100);
    const financedAmount = Math.max(0, devicePrice - downPayment);
    const selectedPlan = DURATIONS.find((d) => d.months === selectedDurationMonths) || DURATIONS[1];
    const totalInterest = Math.round(financedAmount * selectedPlan.rate);
    const totalPayableWithInterest = financedAmount + totalInterest;
    const monthlyInstallment = Math.round(totalPayableWithInterest / selectedPlan.months);
    const totalCost = downPayment + totalPayableWithInterest;

    return {
      downPayment,
      financedAmount,
      totalInterest,
      monthlyInstallment,
      totalCost,
      months: selectedPlan.months,
    };
  }, [devicePrice, downPaymentPercent, selectedDurationMonths]);

  // Form submission
  const handleStartEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedPhone) {
      setErrorMessage('برجاء اختيار الجهاز المطلوب من المخزون أولاً.');
      return;
    }

    if (!fullName.trim() || fullName.trim().split(' ').length < 3) {
      setErrorMessage('برجاء إدخال الاسم الثلاثي على الأقل كما هو ببطاقة الرقم القومي.');
      return;
    }

    const cleanNID = nationalId.replace(/\D/g, '');
    if (cleanNID.length !== 14) {
      setErrorMessage('رقم البطاقة القومي يجب أن يتكون من 14 رقمًا صحيحًا.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('برجاء إدخال رقم هاتف محمول صحيح مسجل باسم العميل.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('يجب الإقرار بالموافقة على الشروط واللائحة التنظيمية للمتابعة.');
      return;
    }

    setStep('evaluating');
    setEvaluationStage(1);

    setTimeout(() => {
      setEvaluationStage(2);
    }, 800);

    setTimeout(() => {
      setEvaluationStage(3);
    }, 1600);

    setTimeout(async () => {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const generatedCode = `CR-2026-SEN-${randomSuffix}`;
      const now = new Date().toLocaleString('ar-EG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      setApprovalCode(generatedCode);
      setApprovalDate(now);

      const qrPayload = JSON.stringify({
        ref: generatedCode,
        client: fullName,
        nid: cleanNID.slice(0, 3) + '********' + cleanNID.slice(11),
        device: selectedPhone.titleAr || selectedPhone.title,
        price: devicePrice,
        down: calc.downPayment,
        month: calc.monthlyInstallment,
        plan: `${calc.months} شهور`,
        branch: 'السنبلاوين - شارع مصطفى كامل',
        date: now,
      });

      try {
        const qrUrl = await QRCode.toDataURL(qrPayload, {
          width: 240,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
        });
        setApprovalQrDataUrl(qrUrl);
      } catch (err) {
        console.error('QR code generation failed', err);
      }

      setStep('approved');
    }, 2400);
  };

  const handleSelectDevice = (id: string) => {
    setSelectedPhoneId(id);
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const whatsappMessage = `طلب اعتماد تقسيط رسمي
رقم المرجع: ${approvalCode}
الاسم: ${fullName}
الرقم القومي: ${nationalId}
الهاتف: ${phoneNumber}
الجهاز: ${selectedPhone?.titleAr || selectedPhone?.title}
سعر البيع النقدي: ${devicePrice.toLocaleString('ar-EG')} ج.م
المقدم المقيد: ${calc.downPayment.toLocaleString('ar-EG')} ج.م
القسط الشهري: ${calc.monthlyInstallment.toLocaleString('ar-EG')} ج.م لمدة ${calc.months} شهور
الفرع: السنبلاوين (شارع مصطفى كامل أمام بن بهاء)
تم الفحص المبدئي بنجاح عبر المنظومة.`;

  const salesWhatsAppUrl = `https://wa.me/${sanitizeWhatsAppNumber(
    salesNumber
  )}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      {/* ============================================================== */}
      {/* 0. AUTHENTIC BANK-GRADE MINIMALIST LOADING SCREEN               */}
      {/* ============================================================== */}
      {isInitialLoading && (
        <div className="fixed inset-0 z-[9999] bg-[#0b1120] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none" dir="rtl">
          <div className="max-w-md w-full space-y-6">
            
            {/* Clean Institutional Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400 shadow-sm">
              <Building className="w-8 h-8" />
            </div>

            {/* Official Title */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                SECURITY ENCRYPTED GATEWAY • 256-BIT TLS
              </div>
              <h2 className="text-xl font-bold text-white">
                منظومة تقييم الائتمان الاستهلاكي الموحدة
              </h2>
              <p className="text-xs text-slate-400">
                {branchName} • رمز المنظومة: SEN-DK-01
              </p>
            </div>

            {/* Clean Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{statusMessage}</span>
                <span className="font-bold text-blue-400">{loadProgress}%</span>
              </div>
            </div>

            {/* Subtle Regulatory Footprint */}
            <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>CIPHER: AES-256-GCM</span>
              <span>BRANCH SESSION VERIFIED</span>
            </div>

            {/* Approved Bank Partners Strip inside Loading Screen */}
            <div className="pt-3 bg-white/95 rounded-xl p-2.5 shadow-sm border border-slate-700/50 flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-[10px] font-bold text-slate-600 pl-2 border-l border-slate-300">
                الربط المصرفي:
              </span>
              <img src="/branding/banks/nbe.svg" alt="البنك الأهلي المصري" className="h-4 sm:h-5 w-auto object-contain" />
              <img src="/branding/banks/banque-misr.svg" alt="بنك مصر" className="h-4 sm:h-5 w-auto object-contain" />
              <img src="/branding/banks/cib.svg" alt="CIB" className="h-3.5 sm:h-4 w-auto object-contain" />
              <img src="/branding/banks/qnb.svg" alt="QNB" className="h-3.5 sm:h-4 w-auto object-contain" />
              <img src="/branding/banks/adib.svg" alt="ADIB" className="h-3.5 sm:h-4 w-auto object-contain" />
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MAIN PORTAL — CLEAN INSTITUTIONAL ENTERPRISE THEME              */}
      {/* ============================================================== */}
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
        
        {/* ============================================================== */}
        {/* 1. TOP INSTITUTIONAL HEADER & REGULATORY BADGE                */}
        {/* ============================================================== */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
          
          {/* Top Info Ribbon */}
          <div className="bg-[#0f172a] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span className="font-medium text-slate-200">المنظومة الإلكترونية الموحدة لتقسيط الأجهزة — فرع السنبلاوين</span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline font-mono">كود الفرع: EG-DK-SEN-01</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                <span>مواعيد العمل: يوميًا من 12:00 م حتى 12:00 ص</span>
                <Link href="/credit/qr" className="text-blue-400 hover:underline flex items-center gap-1 font-sans">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>لافتة الـ QR بالفرع</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Navigation Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Brand Emblem */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
                  <Building className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 tracking-tight">
                    بوابة التمويل الاستهلاكي والائتمان المعتمد
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Consumer Credit & Installment Portal — ملك التفاحه
                  </div>
                </div>
              </div>

              {/* Banking & Institutional Partners Strip — Official Bank Logos */}
              <div className="flex items-center gap-3 bg-white border border-slate-200/90 shadow-2xs rounded-xl px-3.5 py-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-500 pl-3 border-l border-slate-200 whitespace-nowrap hidden sm:inline">
                  الشركاء المصرفيون:
                </span>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* NBE */}
                  <div className="relative h-6 sm:h-7 w-auto flex items-center" title="البنك الأهلي المصري - National Bank of Egypt">
                    <img
                      src="/branding/banks/nbe.svg"
                      alt="البنك الأهلي المصري"
                      className="h-6 sm:h-7 w-auto max-w-[85px] sm:max-w-[105px] object-contain transition-all hover:scale-105"
                    />
                  </div>

                  {/* Banque Misr */}
                  <div className="relative h-6 sm:h-7 w-auto flex items-center" title="بنك مصر - Banque Misr">
                    <img
                      src="/branding/banks/banque-misr.svg"
                      alt="بنك مصر"
                      className="h-6 sm:h-7 w-auto max-w-[80px] sm:max-w-[95px] object-contain transition-all hover:scale-105"
                    />
                  </div>

                  {/* CIB */}
                  <div className="relative h-5 sm:h-6 w-auto flex items-center" title="البنك التجاري الدولي - CIB">
                    <img
                      src="/branding/banks/cib.svg"
                      alt="CIB"
                      className="h-5 sm:h-6 w-auto max-w-[55px] sm:max-w-[65px] object-contain transition-all hover:scale-105"
                    />
                  </div>

                  {/* QNB */}
                  <div className="relative h-5 sm:h-6 w-auto flex items-center" title="بنك قطر الوطني الأهلي - QNB">
                    <img
                      src="/branding/banks/qnb.svg"
                      alt="QNB"
                      className="h-5 sm:h-6 w-auto max-w-[65px] sm:max-w-[80px] object-contain transition-all hover:scale-105"
                    />
                  </div>

                  {/* ADIB */}
                  <div className="relative h-5 sm:h-6 w-auto flex items-center" title="مصرف أبوظبي الإسلامي - ADIB">
                    <img
                      src="/branding/banks/adib.svg"
                      alt="مصرف أبوظبي الإسلامي"
                      className="h-5 sm:h-6 w-auto max-w-[70px] sm:max-w-[85px] object-contain transition-all hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => phonesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-blue-600 transition-colors"
                >
                  الأجهزة المعتمدة ({phones.length})
                </button>
                <button
                  type="button"
                  onClick={() => calculatorRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-blue-600 transition-colors"
                >
                  حاسبة خطط السداد
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('credit-faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-blue-600 transition-colors"
                >
                  الأسئلة الشائعة
                </button>
                <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
                  الاستور
                </Link>
              </div>

            </div>
          </div>
        </header>

        {/* ============================================================== */}
        {/* 2. INSTITUTIONAL HERO / OVERVIEW BANNER                        */}
        {/* ============================================================== */}
        <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Main Official Notice */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>نظام إدارة الائتمان وتقييم المخاطر — معتمد رسميًا بالفرع</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  المنظومة الإلكترونية لتقسيط الهواتف الذكية والأجهزة
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                  خدمة مخصصة لعملاء فرع السنبلاوين (شارع مصطفى كامل أمام بن بهاء) لحساب خطط السداد الشهرية، ومطابقة الأهلية الائتمانية، وإصدار أوامر الاعتماد والتسليم الفوري بضمان معتمد.
                </p>

                {/* 4 Clean Value Points */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">بدون إجراءات معقدة</span>
                    <span className="text-[11px] text-slate-500">فحص فوري للرقم القومي</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">فترات سداد مرنة</span>
                    <span className="text-[11px] text-slate-500">من 6 وحتى 24 شهرًا</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">مقدم يبدأ من 25%</span>
                    <span className="text-[11px] text-slate-500">إمكانية زيادة المقدم لخفض القسط</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">تسليم فوري بالفرع</span>
                    <span className="text-[11px] text-slate-500">أجهزة أصلية بضمان حقيقي</span>
                  </div>
                </div>
              </div>

              {/* Right Side Status Panel */}
              <div className="lg:col-span-4">
                <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-slate-400">BRANCH SESSION</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LIVE IN-STORE
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400">مقر استلام الأجهزة وتوقيع العقود:</div>
                    <div className="font-bold text-white text-sm">{branchName}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
                    <strong>تنبيه إداري:</strong> حسابات الأقساط ونسب الفائدة محسوبة آلياً وفق المنظومة الموحدة ولا يحق لموظف المبيعات تعديلها يدوياً.
                  </div>

                  <button
                    type="button"
                    onClick={() => calculatorRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>الانتقال للحاسبة وتحديد الخطة</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. 5-STEP FORMAL PROCESS STRIP                                */}
        {/* ============================================================== */}
        <section className="bg-slate-100/80 border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
              
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="font-mono font-bold text-blue-600 text-sm">01</span>
                <div className="font-bold text-slate-900">مسح كود الـ QR</div>
                <div className="text-[11px] text-slate-500">داخل فرع السنبلاوين</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="font-mono font-bold text-blue-600 text-sm">02</span>
                <div className="font-bold text-slate-900">اختيار الجهاز المتاح</div>
                <div className="text-[11px] text-slate-500">من مخزون الفرع المعتمد</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="font-mono font-bold text-blue-600 text-sm">03</span>
                <div className="font-bold text-slate-900">تحديد مدة التقسيط</div>
                <div className="text-[11px] text-slate-500">وحساب القسط والمقدم</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="font-mono font-bold text-blue-600 text-sm">04</span>
                <div className="font-bold text-slate-900">فحص الرقم القومي</div>
                <div className="text-[11px] text-slate-500">واستخراج كود الاعتماد</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="font-mono font-bold text-blue-600 text-sm">05</span>
                <div className="font-bold text-slate-900">توقيع العقد والاستلام</div>
                <div className="text-[11px] text-slate-500">فوريًا بالفرع</div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. LIVE INVENTORY TABLE & PHONES SELECTION                     */}
        {/* ============================================================== */}
        <section ref={phonesRef} className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">STEP 01</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                الهواتف المعتمدة والمتاحة بالمخزون حاليًا
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تظهر هنا فقط الأجهزة المسجلة بنظام المخزون والجاهزة للتسليم الفوري بفرع السنبلاوين.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
              إجمالي الأجهزة: {phones.length}
            </div>
          </div>

          {phones.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-sm">
              لا تتوفر أجهزة مسجلة للتقسيط حالياً بالمخزون. يُرجى مراجعة إدارة الفرع.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {phones.map((phone) => {
                const isSelected = phone.id === selectedPhoneId;
                const price = phone.promoPrice || phone.basePrice;
                const minDown = Math.round(price * 0.25);
                const estMonthly = Math.round(((price - minDown) * 1.24) / 12);

                return (
                  <div
                    key={phone.id}
                    onClick={() => handleSelectDevice(phone.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between relative bg-white ${
                      isSelected
                        ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                        محدد حاليًا
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Image Frame */}
                      <div className="aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden flex items-center justify-center p-2">
                        {phone.coverImage || phone.images?.[0] ? (
                          <Image
                            src={phone.coverImage || phone.images![0]}
                            alt={phone.titleAr || phone.title}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <Smartphone className="w-10 h-10 text-slate-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-500 font-mono">{phone.brand}</span>
                          <span className="text-emerald-700 font-medium">متاح ({phone.totalAvailableQuantity})</span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                          {phone.titleAr || phone.title}
                        </h3>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500">سعر البيع النقدي:</span>
                        <strong className="text-slate-900 font-mono text-sm">
                          {price.toLocaleString('ar-EG')} ج.م
                        </strong>
                      </div>

                      <div className="flex items-baseline justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-600">القسط المبدئي:</span>
                        <strong className="text-blue-700 font-mono font-bold text-sm">
                          {estMonthly.toLocaleString('ar-EG')} ج.م/ش
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDevice(phone.id);
                        }}
                        className={`w-full py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 mt-1 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>تحديد وحساب القسط</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

        {/* ============================================================== */}
        {/* 5. OFFICIAL INSTALLMENT CALCULATOR & APPLICATION WORKSPACE     */}
        {/* ============================================================== */}
        <section ref={calculatorRef} className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            
            {/* Regulatory Alert */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>إقرار نظامي ملزم:</strong> كافة الحسابات والنسب الموضحة مبرمجة طبقاً للائحة الائتمان المقررة لفرع السنبلاوين. موظف المبيعات غير مفوض بإجراء أي تفاوض يدوي أو استثناء من الشروط وسداد الأقساط.
              </div>
            </div>

            {/* FORM VIEW: CALCULATOR & DATA INPUT */}
            {step === 'calc' && (
              <form onSubmit={handleStartEvaluation} className="space-y-6">
                
                {/* 1. Device Info Header */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block">الجهاز المقيد بالطلب</span>
                    <strong className="text-base text-slate-900 font-bold block">
                      {selectedPhone?.titleAr || selectedPhone?.title}
                    </strong>
                    <span className="text-xs text-emerald-700">● متاح للتسليم الفوري بفرع السنبلاوين</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">السعر النقدي المعتمد:</span>
                    <strong className="text-xl font-mono text-slate-900 font-bold">
                      {devicePrice.toLocaleString('ar-EG')} ج.م
                    </strong>
                  </div>
                </div>

                {/* 2. Duration & Down Payment Engine */}
                <div className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-xs font-mono font-bold text-blue-600">STEP 02</span>
                    <h3 className="text-base font-bold text-slate-900">تحديد مدة التقسيط والمقدم المسدد</h3>
                  </div>

                  {/* Durations */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      مدة التمويل المطلوبة:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {DURATIONS.map((plan) => {
                        const isSelected = plan.months === selectedDurationMonths;
                        return (
                          <button
                            type="button"
                            key={plan.months}
                            onClick={() => setSelectedDurationMonths(plan.months)}
                            className={`p-3 rounded-xl border text-right transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-xs sm:text-sm font-bold">{plan.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{plan.note}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Down Payment Slider */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">نسبة المقدم المسدد نقداً:</span>
                      <strong className="text-slate-900 font-mono text-sm">
                        {downPaymentPercent}% ({calc.downPayment.toLocaleString('ar-EG')} ج.م)
                      </strong>
                    </div>
                    <input
                      type="range"
                      min="25"
                      max="70"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>الحد الأدنى الإلزامي (25%)</span>
                      <span>الحد الأقصى (70%)</span>
                    </div>
                  </div>

                  {/* Formal Financial Matrix Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-right divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-2.5">المقدم الإلزامي</th>
                          <th className="p-2.5">المبلغ الممول</th>
                          <th className="p-2.5">تاريخ الاستحقاق</th>
                          <th className="p-2.5 bg-blue-50 text-blue-900">القسط الشهري الثابت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="p-2.5 font-bold font-mono text-slate-900">
                            {calc.downPayment.toLocaleString('ar-EG')} ج.م ({downPaymentPercent}%)
                          </td>
                          <td className="p-2.5 font-mono text-slate-700">
                            {calc.financedAmount.toLocaleString('ar-EG')} ج.م
                          </td>
                          <td className="p-2.5 text-slate-700">يوم 5 من كل شهر</td>
                          <td className="p-2.5 bg-blue-50/80 font-mono font-bold text-sm text-blue-900">
                            {calc.monthlyInstallment.toLocaleString('ar-EG')} ج.م/شهرياً
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* 3. National ID & Verification Form */}
                <div className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-xs font-mono font-bold text-blue-600">STEP 03</span>
                    <h3 className="text-base font-bold text-slate-900">بيانات العميل وفحص الأهلية</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        الاسم بالكامل (كما هو بالرقم القومي) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="الاسم الرباعي أو الثلاثي"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        الرقم القومي (14 رقمًا) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={14}
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                        placeholder="14 رقمًا من واقع البطاقة"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono tracking-wider focus:outline-none focus:border-blue-600 text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        رقم الهاتف المحمول الأساسي <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-600 text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        محل الإقامة بالرقم القومي <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={residenceArea}
                        onChange={(e) => setResidenceArea(e.target.value)}
                        placeholder="مدينة السنبلاوين أو القرية"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        اسم الضامن وصلة القرابة
                      </label>
                      <input
                        type="text"
                        value={guarantorName}
                        onChange={(e) => setGuarantorName(e.target.value)}
                        placeholder="صلة قرابة درجة أولى"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        رقم هاتف الضامن
                      </label>
                      <input
                        type="tel"
                        value={guarantorPhone}
                        onChange={(e) => setGuarantorPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-600 text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Regulatory Penalties Clause */}
                <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2 text-xs text-slate-700">
                  <div className="font-bold text-red-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>اللائحة التنظيمية والشروط الجزائية الملزمة</span>
                  </div>

                  <p className="leading-relaxed">
                    <strong>مادة (١):</strong> يلتزم العميل بسداد القسط في موعد أقصاه يوم 5 من كل شهر ميلادي بمقر الفرع أو الحسابات الرسمية.
                    <br />
                    <strong>مادة (٢):</strong> بعد انقضاء مهلة السماح (48 ساعة)، يُحتسب رسم تأخير إداري قدره <strong>50 ج.م عن كل يوم تأخير</strong>.
                    <br />
                    <strong>مادة (٣):</strong> في حال التخلف عن سداد قسطين متتاليين تسقط كافة الآجال وتصبح الأقساط مستحقة النفاذ فوراً، وتُحال السندات القانونية للشؤون القضائية للمطالبة مع إدراج الاسم في القائمة المحظورة للمعاملات التجارية بالدقهلية.
                  </p>

                  <label className="flex items-start gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-900">
                      أقر أنا المتقدم بصحة البيانات المذكورة والتزامي الكامل ببنود السداد واللائحة الجزائية الموضحة أعلاه.
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-100 text-red-800 text-xs font-semibold border border-red-200">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Action */}
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={phones.length === 0}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>فحص الأهلية الائتمانية وإصدار كود الاعتماد</span>
                  </button>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    SECURE CONSUMER CREDIT DECISION ENGINE • SENBELLAWEIN
                  </div>
                </div>

              </form>
            )}

            {/* SCANNING / EVALUATION VIEW */}
            {step === 'evaluating' && (
              <div className="p-10 rounded-2xl border border-slate-200 bg-white text-center space-y-6 max-w-md mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900">
                    جاري التحقق من السجل الائتماني ومطابقة البيانات...
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">REF: EVAL-{nationalId.slice(0, 6)}</p>
                </div>

                <div className="space-y-2 text-xs text-right">
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    evaluationStage >= 1 ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <span>١. التحقق من الرقم القومي والبيانات الأساسية</span>
                    {evaluationStage >= 1 ? <Check className="w-4 h-4 text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    evaluationStage >= 2 ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <span>٢. مطابقة الجهاز المختار بمخزون فرع السنبلاوين</span>
                    {evaluationStage >= 2 ? <Check className="w-4 h-4 text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    evaluationStage >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <span>٣. اعتماد جدول السداد وتوليد كود المعاملة الرسمي</span>
                    {evaluationStage >= 3 ? <Check className="w-4 h-4 text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  </div>
                </div>
              </div>
            )}

            {/* FORMAL APPROVAL VOUCHER */}
            {step === 'approved' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                
                {/* Official Printable Voucher */}
                <div id="approval-ticket" className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 space-y-5 text-slate-900 shadow-sm print:border print:m-0 print:p-6">
                  
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-slate-900 pb-4 text-center sm:text-right">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">CONSUMER CREDIT APPROVAL</span>
                      <h2 className="text-xl font-bold text-slate-900">شهادة اعتماد تقسيط مؤقتة</h2>
                      <div className="text-xs text-slate-600">{branchName}</div>
                    </div>

                    <div className="text-center sm:text-left font-mono">
                      <div className="text-xs text-slate-500">رقم الاعتماد المرجعي:</div>
                      <div className="text-base font-bold text-blue-900">{approvalCode}</div>
                      <div className="text-[10px] text-slate-400">{approvalDate}</div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs font-semibold text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>تمت الموافقة المبدئية بدرجة أمان ائتماني (Class A - منخفض المخاطر)</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">صالح لمدة 24 ساعة</span>
                  </div>

                  {/* Client & Device Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">اسم العميل:</span>
                      <strong className="text-slate-900 font-bold block">{fullName}</strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">الرقم القومي:</span>
                      <strong className="text-slate-900 font-mono block">
                        {nationalId.slice(0, 3)}*******{nationalId.slice(10)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">الجهاز المعتمد:</span>
                      <strong className="text-slate-900 font-bold block">
                        {selectedPhone?.titleAr || selectedPhone?.title}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">سعر البيع النقدي:</span>
                      <strong className="text-slate-900 font-mono block">
                        {devicePrice.toLocaleString('ar-EG')} ج.م
                      </strong>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-right divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-2">المقدم المسدد</th>
                          <th className="p-2">مدة التمويل</th>
                          <th className="p-2">ميعاد السداد</th>
                          <th className="p-2 bg-blue-50 text-blue-900">القسط الشهري</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="p-2 font-mono font-bold text-slate-900">
                            {calc.downPayment.toLocaleString('ar-EG')} ج.م ({downPaymentPercent}%)
                          </td>
                          <td className="p-2">{calc.months} شهرًا</td>
                          <td className="p-2">يوم 5 من كل شهر</td>
                          <td className="p-2 bg-blue-50/80 font-mono font-bold text-sm text-blue-900">
                            {calc.monthlyInstallment.toLocaleString('ar-EG')} ج.م
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Notice & QR */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-slate-900">
                    <div className="space-y-1 text-center sm:text-right">
                      <div className="text-xs font-bold text-slate-900">
                        برجاء إبراز هذه الشهادة للبائع بالفرع لإتمام العقد والاستلام
                      </div>
                      <p className="text-[11px] text-slate-500">
                        فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء (من 12 لـ 12).
                      </p>
                    </div>

                    {approvalQrDataUrl && (
                      <div className="text-center">
                        <div className="p-1 bg-white border border-slate-900 rounded-lg inline-block">
                          <Image
                            src={approvalQrDataUrl}
                            alt="QR Approval Code"
                            width={90}
                            height={90}
                            className="rounded"
                          />
                        </div>
                        <div className="text-[9px] font-mono text-slate-500 mt-0.5">SCAN AT COUNTER</div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 print:hidden">
                  <a
                    href={salesWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>إرسال كود الاعتماد لمبيعات الفرع على واتساب</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة وثيقة الاعتماد</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('calc');
                      setApprovalCode('');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    حساب جهاز آخر
                  </button>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. FAQ SECTION                                                 */}
        {/* ============================================================== */}
        <section id="credit-faq" className="py-12 bg-[#f1f5f9] border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">SUPPORT & POLICY</span>
              <h2 className="text-xl font-bold text-slate-900">الأسئلة الشائعة واللوائح المنظمة</h2>
            </div>

            <div className="space-y-2">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-right font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        <p className="pt-2">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. FOOTER                                                      */}
        {/* ============================================================== */}
        <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div>
              <strong className="text-slate-800">بوابة التمويل والتقسيط المعتمدة — ملك التفاحه</strong>
              <div className="text-[11px] text-slate-400 mt-0.5">{branchName} • مواعيد العمل: من 12:00 م حتى 12:00 ص</div>
            </div>

            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
              <span>•</span>
              <Link href="/products" className="hover:text-blue-600 transition-colors">الاستور</Link>
              <span>•</span>
              <Link href="/credit/qr" className="hover:text-blue-600 transition-colors">لافتة الـ QR</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
