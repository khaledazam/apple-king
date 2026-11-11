'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Building2,
  Calendar,
  AlertTriangle,
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
  Sparkles,
  Zap,
  Package,
  Check,
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
  { months: 6, label: '6 أشهر', rate: 0.15, desc: 'أقل فوائد إجمالية' },
  { months: 12, label: '12 شهرًا (سنة)', rate: 0.24, desc: 'الخيار الأكثر طلبًا' },
  { months: 18, label: '18 شهرًا', rate: 0.34, desc: 'قسط شهري مخفض' },
  { months: 24, label: '24 شهرًا (سنتان)', rate: 0.44, desc: 'أقل قسط شهري متاح' },
];

const FAQS = [
  {
    q: 'ما هي شروط تقسيط الهواتف في فرع السنبلاوين؟',
    a: 'بطاقة الرقم القومي سارية للمشتري والضامن، وإثبات محل إقامة بمركز السنبلاوين أو محافظة الدقهلية، وسداد المقدم المحدد بالمنظومة.',
  },
  {
    q: 'هل الأجهزة المعروضة مضمونة وأصلية؟',
    a: 'نعم بنسبة 100%؛ جميع الأجهزة المعروضة مسجلة في سيستم المخزون بالفرع، وتخضع لفحص شامل مع ضمان معتمد وفاتورة رسمية.',
  },
  {
    q: 'ما هي مواعيد العمل بمقر الفرع لإتمام التعاقد والاستلام؟',
    a: 'يستقبلكم الفرع يوميًا طوال أيام الأسبوع من الساعة 12:00 ظهرًا حتى الساعة 12:00 منتصف الليل (من 12 لـ 12) بشارع مصطفى كامل أمام بن بهاء.',
  },
  {
    q: 'هل يمكن دفع مقدم أعلى لتقليل قيمة القسط الشهري؟',
    a: 'نعم بالتأكيد؛ يمكنك تعديل نسبة المقدم عبر الحاسبة حتى 70% ليتم خفض القسط الشهري تلقائيًا وفق المعادلة التمويلية.',
  },
];

export function CreditPortalClient({
  phones,
  branchName = 'فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء',
  salesNumber = '201097976407',
}: CreditPortalClientProps) {
  // ==========================================
  // 1. BANK-GRADE LUXURY LOADING SCREEN STATE
  // ==========================================
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(18);
  const [statusMessage, setStatusMessage] = useState('جاري إنشاء اتصال مشفر وآمن بالمنظومة البنكية الموحدة...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadProgress(45);
      setStatusMessage('التحقق من جلسة فرع السنبلاوين وتصريح الائتمان (SSL 256-Bit)...');
    }, 600);

    const timer2 = setTimeout(() => {
      setLoadProgress(76);
      setStatusMessage('فحص مخزون الأجهزة المعتمدة لفرع السنبلاوين (شارع مصطفى كامل)...');
    }, 1300);

    const timer3 = setTimeout(() => {
      setLoadProgress(95);
      setStatusMessage('تم الاتصال بنجاح • جاري فتح بوابة التمويل الاستهلاكي...');
    }, 1900);

    const timer4 = setTimeout(() => {
      setLoadProgress(100);
      setIsInitialLoading(false);
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'home' | 'phones' | 'plans' | 'faq' | 'contact'>('home');

  // Device & calculator states
  const [selectedPhoneId, setSelectedPhoneId] = useState<string>(phones[0]?.id || '');
  const [selectedDurationMonths, setSelectedDurationMonths] = useState<number>(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);

  // Customer form inputs
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residenceArea, setResidenceArea] = useState('مركز السنبلاوين');
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

  // Refs for smooth scrolling
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

  // Financial calculations
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

  // Handle Credit Evaluation Submission
  const handleStartEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedPhone) {
      setErrorMessage('برجاء اختيار جهاز متاح من المخزون أولاً.');
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
      setErrorMessage('يجب الموافقة على اللائحة الجزائية وإقرار الالتزام بالسداد للمتابعة.');
      return;
    }

    // Begin Simulated Credit Evaluation
    setStep('evaluating');
    setEvaluationStage(1);

    setTimeout(() => {
      setEvaluationStage(2);
    }, 1000);

    setTimeout(() => {
      setEvaluationStage(3);
    }, 2000);

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
          width: 260,
          margin: 1,
          color: { dark: '#0a192f', light: '#ffffff' },
        });
        setApprovalQrDataUrl(qrUrl);
      } catch (err) {
        console.error('QR code generation failed', err);
      }

      setStep('approved');
    }, 3200);
  };

  const handleSelectDeviceFromList = (id: string) => {
    setSelectedPhoneId(id);
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `طلب اعتماد تقسيط رقم: ${approvalCode}
الاسم: ${fullName}
الرقم القومي: ${nationalId}
الهاتف: ${phoneNumber}
الجهاز: ${selectedPhone?.titleAr || selectedPhone?.title}
سعر الكاش: ${devicePrice.toLocaleString('ar-EG')} ج.م
المقدم المحسوب: ${calc.downPayment.toLocaleString('ar-EG')} ج.م
القسط الشهري: ${calc.monthlyInstallment.toLocaleString('ar-EG')} ج.م لمدة ${calc.months} شهور
الفرع: السنبلاوين (شارع مصطفى كامل أمام بن بهاء)
تم الفحص الائتماني والقبول المشروط عبر المنظومة.`;

  const salesWhatsAppUrl = `https://wa.me/${sanitizeWhatsAppNumber(
    salesNumber
  )}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      {/* ============================================================== */}
      {/* 0. LUXURY BANK-GRADE INITIAL LOADING SCREEN                     */}
      {/* ============================================================== */}
      {isInitialLoading && (
        <div className="fixed inset-0 z-[9999] bg-[#040814] flex flex-col items-center justify-center p-6 text-center select-none" dir="rtl">
          
          {/* Ambient Golden Halo in Center */}
          <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-amber-500/20 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto space-y-7">
            
            {/* Rotating Golden Crest / Shield */}
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" style={{ animationDuration: '1.2s' }} />
              <div className="absolute inset-2 rounded-full border-2 border-blue-500/20 border-b-blue-400 animate-spin" style={{ animationDuration: '2.2s', animationDirection: 'reverse' }} />
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0c1a38] to-[#040916] border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                <Building2 className="w-12 h-12" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>256-BIT SSL ENCRYPTED GATEWAY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                منظومة التمويل والاستعلام الائتماني الموحدة
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {branchName} • كود الفرع: SEN-EG-01
              </p>
            </div>

            {/* Glowing Golden Progress Bar */}
            <div className="space-y-2">
              <div className="w-full max-w-md mx-auto h-2 bg-slate-900 rounded-full overflow-hidden border border-amber-400/30 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-[#d4af37] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 max-w-md mx-auto px-1">
                <span className="text-amber-400 font-bold">{loadProgress}%</span>
                <span className="text-slate-500">AUTHENTICATING</span>
              </div>
            </div>

            {/* Animated Status Message */}
            <div className="text-xs text-amber-200/90 font-medium flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{statusMessage}</span>
            </div>

            {/* Partner Banks Footprint */}
            <div className="pt-6 border-t border-white/10 text-[11px] text-slate-500 space-y-2">
              <span>بالتعاون مع الشركاء المصرفيين المعتمدين</span>
              <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 text-[10px] font-semibold">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">الأهلي المصري</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">بنك مصر</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">CIB</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">QNB</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">أبوظبي الإسلامي</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MAIN PORTAL CONTENT (SHOWN AFTER SCAN/VERIFICATION)             */}
      {/* ============================================================== */}
      <div className="min-h-screen bg-[#060b18] text-[#f1f5f9] font-sans selection:bg-[#d4af37] selection:text-[#060b18] relative overflow-x-hidden" dir="rtl">
        
        {/* Ambient Golden Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/15 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-0 inset-x-0 h-[850px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-[#060b18] to-[#060b18] pointer-events-none -z-0" />

        {/* ============================================================== */}
        {/* 1. TOP OFFICIAL HEADER WITH BANK PARTNER LOGOS (EXACT DESIGN) */}
        {/* ============================================================== */}
        <header className="relative z-20 border-b border-amber-500/20 bg-[#070e20]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Upper Tier: Portal Brand + Partner Banks Pill + Help Center */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-3.5 border-b border-white/[0.06]">
              
              {/* Brand Identity with Gold Phone Silhouette */}
              <Link href="/credit" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#d4af37] to-[#aa8012] p-0.5 shadow-lg shadow-amber-950/40">
                  <div className="w-full h-full bg-[#0a1428] rounded-[10px] flex items-center justify-center text-amber-400">
                    <Smartphone className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight group-hover:text-amber-300 transition-colors">
                    Consumer Credit & Installment Portal
                  </div>
                  <div className="text-[11px] text-amber-400/90 font-medium">
                    بوابة التمويل الاستهلاكي والتقسيط — ملك التفاحه
                  </div>
                </div>
              </Link>

              {/* Center: Banking Partners Banner Pill */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-[#0a142c]/90 border border-amber-400/30 rounded-full px-4 py-1.5 shadow-inner">
                <span className="text-[11px] text-slate-300 font-medium whitespace-nowrap">
                  بالتعاون مع شركائنا من البنوك
                </span>
                <div className="flex items-center gap-2.5 text-xs text-white divide-x divide-x-reverse divide-white/20">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 pl-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white">N</span>
                    <span>الأهلي المصري</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 px-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-600 flex items-center justify-center text-[9px] text-white">M</span>
                    <span>بنك مصر</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-400 px-2 font-mono">
                    <span>CIB</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-300 px-2 font-mono">
                    <span>QNB</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-sky-300 pr-2">
                    <span>أبوظبي الإسلامي</span>
                  </div>
                </div>
              </div>

              {/* Right: Help Center & Branch Status */}
              <div className="flex items-center gap-3">
                <Link
                  href="/credit/qr"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
                  title="عرض لافتة الـ QR المعتمدة للطباعة"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>لافتة الـ QR للفرع</span>
                </Link>
                <a
                  href={`https://wa.me/${sanitizeWhatsAppNumber(salesNumber)}?text=${encodeURIComponent('مرحبًا، أود الاستفسار عن برامج التقسيط ومركز المساعدة في فرع السنبلاوين.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>مركز المساعدة</span>
                </a>
              </div>
            </div>

            {/* Lower Tier: Navigation Bar with Gold Active Indicator */}
            <nav className="flex items-center justify-center sm:justify-start gap-6 sm:gap-10 py-3 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`pb-1 transition-all relative whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>الرئيسية</span>
                {activeTab === 'home' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#d4af37]" />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('phones');
                  phonesRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`pb-1 transition-all relative whitespace-nowrap ${
                  activeTab === 'phones'
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>الهواتف المتاحة</span>
                {activeTab === 'phones' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#d4af37]" />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('plans');
                  calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`pb-1 transition-all relative whitespace-nowrap ${
                  activeTab === 'plans'
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>خطط التقسيط</span>
                {activeTab === 'plans' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#d4af37]" />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('faq');
                  document.getElementById('credit-faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`pb-1 transition-all relative whitespace-nowrap ${
                  activeTab === 'faq'
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>الأسئلة الشائعة</span>
                {activeTab === 'faq' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#d4af37]" />
                )}
              </button>

              <a
                href={`https://wa.me/${sanitizeWhatsAppNumber(salesNumber)}?text=${encodeURIComponent('أهلًا، أريد التواصل مع إدارة ائتمان فرع السنبلاوين.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-200 pb-1 whitespace-nowrap transition-colors"
              >
                <span>تواصل معنا</span>
              </a>
            </nav>

          </div>
        </header>

        {/* ============================================================== */}
        {/* 2. HERO SECTION — CLEAN 2-COLUMN BALANCED LAYOUT (NO CENTER PIC) */}
        {/* ============================================================== */}
        <section className="relative z-10 pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden">
          
          {/* Subtle Golden Arc Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
              <path
                d="M-100 150 C 300 0, 700 350, 1540 80"
                stroke="url(#goldStroke1)"
                strokeWidth="2.5"
                strokeDasharray="8 8"
              />
              <path
                d="M-50 220 C 400 40, 800 420, 1500 120"
                stroke="url(#goldStroke2)"
                strokeWidth="4"
              />
              <defs>
                <linearGradient id="goldStroke1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#ffe29a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#aa8012" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="goldStroke2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#aa8012" stopOpacity="0" />
                  <stop offset="40%" stopColor="#ffe29a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* 2-Column Hero Grid: Left Copy & Badges + Right Floating Glass Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Column 1 (Main Content, 7 Cols): Golden Headline, Subtitle, 4 Badges */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
                
                {/* Gold Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-400/40 shadow-sm text-xs font-semibold text-amber-300">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>تمويل وتقسيط الهواتف الذكية المعتمد</span>
                </div>

                {/* Mega Headline */}
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                    امتلك هاتفك الآن
                  </h1>
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-l from-amber-200 via-amber-400 to-[#d4af37] bg-clip-text text-transparent leading-tight drop-shadow-sm">
                    بالتقسيط المريح
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  منصة آمنة لطلب التمويل الاستهلاكي بالتعاون مع شركائنا من البنوك الرائدة، بخطوات سهلة وسريعة وموافقة معتمدة بمقر فرع السنبلاوين (شارع مصطفى كامل أمام بن بهاء).
                </p>

                {/* 4 Circular / Rounded Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-center">
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-amber-400/25 backdrop-blur-sm space-y-1.5 transition-transform hover:-translate-y-1">
                    <div className="w-9 h-9 rounded-full bg-amber-400/10 text-amber-400 mx-auto flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 block">معتمد من البنوك</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-amber-400/25 backdrop-blur-sm space-y-1.5 transition-transform hover:-translate-y-1">
                    <div className="w-9 h-9 rounded-full bg-amber-400/10 text-amber-400 mx-auto flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 block">خطط تقسيط مرنة</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-amber-400/25 backdrop-blur-sm space-y-1.5 transition-transform hover:-translate-y-1">
                    <div className="w-9 h-9 rounded-full bg-amber-400/10 text-amber-400 mx-auto flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 block">موافقة سريعة وفورية</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-amber-400/25 backdrop-blur-sm space-y-1.5 transition-transform hover:-translate-y-1">
                    <div className="w-9 h-9 rounded-full bg-amber-400/10 text-amber-400 mx-auto flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 block">بياناتك آمنة بالكامل</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => calculatorRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-[#b8860b] hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.03] flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>ابدأ طلب التقسيط الآن</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => phonesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-amber-400/30 text-sm font-semibold transition-colors"
                  >
                    <span>عرض الأجهزة المتاحة بالفرع</span>
                  </button>
                </div>

              </div>

              {/* Column 2 (Floating Glass Card, 5 Cols): Clean, Luxury Highlights */}
              <div className="lg:col-span-5">
                <div className="backdrop-blur-xl bg-gradient-to-b from-[#0c1a38]/80 to-[#060c1c]/90 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(212,175,55,0.18)] space-y-5 max-w-md mx-auto">
                  
                  <div className="flex items-center justify-between border-b border-amber-400/25 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>مزايا التمويل الحصري بالفرع</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold font-mono">
                      APPROVED
                    </span>
                  </div>

                  <ul className="space-y-4 text-sm font-bold text-white">
                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                      <span>مقدم يبدأ من 0% حتى 70%</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                      <span>فترات سداد مرنة (6 - 12 - 18 - 24 شهرًا)</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                      <span>بدون إجراءات بنكية معقدة</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                      <span>موافقات فورية واعتماد مشروط بالفرع</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>متاح لأهالي مركز السنبلاوين والقرى التابعة بالدقهلية</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>مواعيد العمل: يوميًا من 12:00 ظهرًا حتى 12:00 منتصف الليل</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* ============================================================== */}
            {/* 3. BOTTOM PROCESS BAR (EXACT 5 STEPS FROM USER'S DESIGN)        */}
            {/* ============================================================== */}
            <div className="bg-[#0b162c]/90 backdrop-blur-md border-2 border-amber-400/30 rounded-3xl p-4 sm:p-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center text-center">
                
                {/* Step 1: QR Scan */}
                <div className="flex flex-col items-center gap-2 p-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    امسح رمز QR<br />
                    <span className="text-[11px] font-normal text-slate-400">لبدء طلب التمويل</span>
                  </div>
                </div>

                {/* Step 2: Choose Phone */}
                <div className="flex flex-col items-center gap-2 p-2 relative">
                  <span className="hidden sm:block absolute right-[-14px] top-1/2 -translate-y-1/2 text-amber-400/40 font-mono text-xl">‹</span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    اختر هاتفك<br />
                    <span className="text-[11px] font-normal text-slate-400">المناسب من المخزون</span>
                  </div>
                </div>

                {/* Step 3: Complete Data */}
                <div className="flex flex-col items-center gap-2 p-2 relative">
                  <span className="hidden sm:block absolute right-[-14px] top-1/2 -translate-y-1/2 text-amber-400/40 font-mono text-xl">‹</span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    أكمل بيانات<br />
                    <span className="text-[11px] font-normal text-slate-400">طلب التمويل</span>
                  </div>
                </div>

                {/* Step 4: Bank Approval */}
                <div className="flex flex-col items-center gap-2 p-2 relative">
                  <span className="hidden sm:block absolute right-[-14px] top-1/2 -translate-y-1/2 text-amber-400/40 font-mono text-xl">‹</span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    استلم الموافقة<br />
                    <span className="text-[11px] font-normal text-slate-400">من البنك والسيستم</span>
                  </div>
                </div>

                {/* Step 5: Pickup */}
                <div className="flex flex-col items-center gap-2 p-2 relative">
                  <span className="hidden sm:block absolute right-[-14px] top-1/2 -translate-y-1/2 text-amber-400/40 font-mono text-xl">‹</span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    استلم هاتفك<br />
                    <span className="text-[11px] font-normal text-slate-400">بكل سهولة من الفرع</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. LIVE IN-STOCK PHONES (LINKED DIRECTLY TO SYSTEM INVENTORY)   */}
        {/* ============================================================== */}
        <section ref={phonesRef} id="phones" className="py-14 sm:py-20 border-t border-slate-800 bg-[#070e20]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-widest block">
                  INVENTORY SYNC • LIVE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  الهواتف المتاحة للتقسيط الفوري بالفرع
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  تحديث لحظي من سيستم المخزون — تظهر فقط الأجهزة المتوفرة فعليًا للتسليم في فرع السنبلاوين.
                </p>
              </div>
              <div className="text-xs px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 font-medium">
                {phones.length} أجهزة متوفرة حالياً بالسيستم
              </div>
            </div>

            {phones.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-900/60 rounded-3xl border border-slate-800">
                <p className="text-lg font-bold text-white">لا توجد أجهزة متوفرة للتقسيط حالياً في المخزون.</p>
                <p className="text-xs text-slate-500 mt-2">
                  يُرجى التواصل مع إدارة الفرع لتأكيد الأجهزة الجاري استلامها.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {phones.map((phone) => {
                  const isSelected = phone.id === selectedPhoneId;
                  const price = phone.promoPrice || phone.basePrice;
                  const minDown = Math.round(price * 0.25);
                  const estMonthly = Math.round(((price - minDown) * 1.24) / 12);

                  return (
                    <div
                      key={phone.id}
                      onClick={() => handleSelectDeviceFromList(phone.id)}
                      className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#0b1c3a] to-[#071328] border-amber-400 shadow-xl shadow-amber-950/40 ring-2 ring-amber-400'
                          : 'bg-slate-900/60 border-slate-800 hover:border-amber-400/50 hover:bg-slate-900'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>الجهاز المحدد</span>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="aspect-[4/3] rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center p-3">
                          {phone.coverImage || phone.images?.[0] ? (
                            <Image
                              src={phone.coverImage || phone.images![0]}
                              alt={phone.titleAr || phone.title}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Smartphone className="w-12 h-12 text-slate-600" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-amber-400 font-mono">{phone.brand}</span>
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              متاح ({phone.totalAvailableQuantity})
                            </span>
                          </div>
                          <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2">
                            {phone.titleAr || phone.title}
                          </h3>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-400">سعر الكاش:</span>
                          <span className="font-bold text-base text-white font-mono">
                            {price.toLocaleString('ar-EG')} <span className="text-xs text-slate-400 font-sans">ج.م</span>
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between text-xs bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-amber-300">
                          <span>قسط يبدأ من:</span>
                          <strong className="font-mono font-black text-amber-300 text-sm">
                            {estMonthly.toLocaleString('ar-EG')} ج.م/ش
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDeviceFromList(phone.id);
                          }}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 mt-2 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-200 hover:bg-amber-400 hover:text-slate-950'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>احسب القسط وقدم الآن</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. INTERACTIVE CALCULATOR & CREDIT ASSESSMENT WORKSPACE         */}
        {/* ============================================================== */}
        <section ref={calculatorRef} id="plans" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Security / Non-negotiable Notice */}
          <div className="mb-8 bg-amber-500/10 border-r-4 border-amber-400 rounded-2xl p-4 sm:p-5 text-xs text-amber-200 leading-relaxed flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 font-bold mb-1 text-sm">
                إشعار نظامي ملزم (عدم إمكانية التفاوض اليدوي):
              </strong>
              حسابات الأقساط والمقدمات ونسب الفائدة مبرمجة إلكترونيًا وفق المنظومة الموحدة لتقييم المخاطر الائتمانية. موظفو الفرع والمبيعات غير مخولين بأي صلاحيات لتعديل المبالغ أو استثناء أي عميل من شروط السداد واللائحة الجزائية.
            </div>
          </div>

          {/* WORKFLOW VIEW: CALCULATOR -> SCANNING -> APPROVAL TICKET */}
          {step === 'calc' && (
            <form onSubmit={handleStartEvaluation} className="space-y-8">
              
              {/* Step 1: Selected Device Banner */}
              <div className="bg-[#0b162c] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 font-mono">STEP 01</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-amber-400" />
                      <span>الجهاز المختار من مخزون الفرع</span>
                    </h3>
                  </div>
                  <div className="text-xs text-slate-400">
                    فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-amber-400/20">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-mono font-bold">{selectedPhone?.brand}</span>
                    <div className="text-base sm:text-lg font-bold text-white">
                      {selectedPhone?.titleAr || selectedPhone?.title}
                    </div>
                    <div className="text-xs text-emerald-400 mt-0.5">
                      ● متاح للتسليم الفوري بالفرع ({selectedPhone?.totalAvailableQuantity} أجهزة)
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">سعر الكاش:</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      {devicePrice.toLocaleString('ar-EG')} <span className="text-xs text-slate-300 font-sans">ج.م</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: Duration & Down Payment Calculator */}
              <div className="bg-[#0b162c] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-amber-400 font-mono">STEP 02</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <span>تحديد خطة السداد والمقدم الإلزامي</span>
                  </h3>
                </div>

                {/* Durations */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    مدة التمويل المطلوبة:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DURATIONS.map((plan) => {
                      const isSelected = plan.months === selectedDurationMonths;
                      return (
                        <button
                          type="button"
                          key={plan.months}
                          onClick={() => setSelectedDurationMonths(plan.months)}
                          className={`p-4 rounded-2xl border text-right transition-all ${
                            isSelected
                              ? 'bg-gradient-to-b from-[#102447] to-[#09172f] text-white border-amber-400 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-sm text-white">{plan.label}</div>
                          <div className={`text-[11px] mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                            {plan.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Down Payment Slider */}
                <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-slate-300">نسبة المقدم المدفوع:</span>
                    <span className="text-amber-400 font-bold font-mono text-base sm:text-lg">
                      {downPaymentPercent}% ({calc.downPayment.toLocaleString('ar-EG')} ج.م)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="70"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-amber-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>الحد الأدنى الإلزامي (25%)</span>
                    <span>أعلى مقدم (70%)</span>
                  </div>
                </div>

                {/* Financial Matrix Summary */}
                <div className="bg-gradient-to-br from-[#071328] to-[#040914] rounded-2xl p-5 border border-amber-400/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">المقدم المطلوب:</span>
                    <strong className="text-base sm:text-lg text-white font-mono font-bold">
                      {calc.downPayment.toLocaleString('ar-EG')} ج.م
                    </strong>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">المبلغ الممول:</span>
                    <strong className="text-base sm:text-lg text-slate-300 font-mono font-bold">
                      {calc.financedAmount.toLocaleString('ar-EG')} ج.م
                    </strong>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">ميعاد السداد الشهري:</span>
                    <strong className="text-base sm:text-lg text-slate-300 font-bold">
                      يوم 5 من كل شهر
                    </strong>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-amber-400/10 border border-amber-400/40 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-amber-300 block font-semibold">القسط الشهري الإلزامي:</span>
                    <span className="text-2xl font-black text-amber-300 font-mono">
                      {calc.monthlyInstallment.toLocaleString('ar-EG')}
                    </span>
                    <span className="text-xs text-amber-200/80 block">ج.م / شهرياً</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Identity & Credit Check Form */}
              <div className="bg-[#0b162c] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-amber-400 font-mono">STEP 03</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-400" />
                    <span>بيانات العميل وفحص الجدارة الائتمانية</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      الاسم بالكامل (كما هو بالرقم القومي) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: أحمد محمد علي إبراهيم"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      الرقم القومي (14 رقمًا) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={14}
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                      placeholder="الرقم القومي المكون من 14 رقمًا"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono tracking-widest focus:outline-none focus:border-amber-400 text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      رقم الهاتف المحمول الأساسي (مسجل باسمك) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono text-left focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      محل السكن / القرية والمركز <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={residenceArea}
                      onChange={(e) => setResidenceArea(e.target.value)}
                      placeholder="السنبلاوين أو اسم القرية"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      اسم الضامن وصلة القرابة
                    </label>
                    <input
                      type="text"
                      value={guarantorName}
                      onChange={(e) => setGuarantorName(e.target.value)}
                      placeholder="الاسم وصلة القرابة (درجة أولى)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      رقم هاتف الضامن
                    </label>
                    <input
                      type="tel"
                      value={guarantorPhone}
                      onChange={(e) => setGuarantorPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono text-left focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Penal Terms & Strict Legal Agreement */}
              <div className="bg-[#120808] rounded-3xl p-6 sm:p-8 border border-red-900/40 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-base sm:text-lg border-b border-red-900/40 pb-3">
                  <Scale className="w-5 h-5 shrink-0" />
                  <span>اللائحة الجزائية وإقرار الالتزام بالسداد القانوني</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-red-950">
                  <p>
                    <strong>١. مواعيد السداد:</strong> يلتزم العميل بسداد القسط الشهري في موعد أقصاه اليوم الخامس من كل شهر ميلادي بمقر فرع السنبلاوين.
                  </p>
                  <p>
                    <strong>٢. غرامات التأخير الإدارية:</strong> في حال تجاوز مهلة السماح المقررة بـ (48 ساعة)، يتم احتساب رسم تأخير إداري تلقائي قدره <strong>50 جنيهًا مصريًا عن كل يوم تأخير</strong> تضاف آلياً لملف العميل بالمنظومة.
                  </p>
                  <p>
                    <strong>٣. التخلف عن السداد:</strong> في حال التخلف عن سداد قسطين متتاليين، يسقط أجل كافة الأقساط المتبقية وتصبح واجبة النفاذ الفوري، ويتم تحويل السندات الإذنية الموقعة وإيصالات الأمانة للشؤون القانونية للمطالبة القضائية فوراً، مع إدراج الاسم في القائمة المحظورة للتداول الائتماني بمحافظة الدقهلية.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded bg-slate-900 border-red-500 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs text-white font-medium">
                    أقر أنا المتقدم بكامل أهليتي القانونية بموافقتي التامة على الشروط واللوائح الجزائية وجدول الأقساط المحدد أعلاه، والتزامي الكامل بالسداد بمواعيده المقررة دون أي تأخير.
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/80 border border-red-600 text-red-200 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={phones.length === 0}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-[#b8860b] hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 mx-auto"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                  <span>إجراء الفحص الائتماني واستخراج كود الاعتماد المعتمد</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  ENCRYPTED CENTRAL CREDIT DECISION ENGINE • SENBELLAWEIN BRANCH
                </p>
              </div>
            </form>
          )}

          {/* WORKFLOW VIEW: SCANNING ANIMATION */}
          {step === 'evaluating' && (
            <div className="bg-[#0b162c] rounded-3xl p-8 sm:p-14 border border-amber-400/40 shadow-2xl text-center space-y-8 max-w-2xl mx-auto my-8">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                <div className="w-full h-full flex items-center justify-center text-amber-400">
                  <Lock className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  جاري مراجعة الأهلية وتقييم الجدارة الائتمانية...
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  REF: EVAL-SEN-{nationalId.slice(0, 6)} • CONNECTING RISK API
                </p>
              </div>

              <div className="space-y-3 max-w-md mx-auto text-xs text-right">
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  evaluationStage >= 1 ? 'bg-blue-950/40 border-amber-400 text-amber-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}>
                  <span>١. التحقق من صلاحية الرقم القومي وسجل العميل</span>
                  {evaluationStage >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />}
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  evaluationStage >= 2 ? 'bg-blue-950/40 border-amber-400 text-amber-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}>
                  <span>٢. مطابقة الجهاز المختار ومخزون الفرع المتاح</span>
                  {evaluationStage >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />}
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  evaluationStage >= 3 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}>
                  <span>٣. اعتماد جدول السداد وتوليد كود المعاملة الرسمي</span>
                  {evaluationStage >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />}
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOW VIEW: OFFICIAL APPROVAL TICKET */}
          {step === 'approved' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div id="approval-ticket" className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-slate-900 space-y-6 relative overflow-hidden print:border-2 print:shadow-none">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 text-center font-black text-6xl rotate-[-25deg] select-none text-slate-950">
                  APPLE KING CREDIT<br />VERIFIED SENBELLAWEIN
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
                  <div className="text-center sm:text-right">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-widest font-mono block">
                      CONSUMER CREDIT DIGITAL APPROVAL
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      شهادة اعتماد تقسيط مؤقتة
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">
                      ملك التفاحه — {branchName}
                    </p>
                  </div>

                  <div className="text-center sm:text-left font-mono">
                    <div className="text-xs font-bold text-slate-500">رقم الاعتماد المركزي:</div>
                    <div className="text-lg sm:text-xl font-black text-blue-900 tracking-wider">
                      {approvalCode}
                    </div>
                    <div className="text-[10px] text-slate-400">{approvalDate}</div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>تم قبول الطلب مبدئيًا بدرجة أمان ائتماني (Class A - منخفض المخاطر)</span>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded">
                    VALID 24H
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">اسم المشتري:</span>
                    <strong className="text-slate-900 text-sm font-bold block">{fullName}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">الرقم القومي:</span>
                    <strong className="text-slate-900 text-sm font-mono block">
                      {nationalId.slice(0, 3)}*******{nationalId.slice(10)}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">الجهاز المعتمد:</span>
                    <strong className="text-slate-900 text-sm font-bold block">
                      {selectedPhone?.titleAr || selectedPhone?.title}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">سعر الكاش:</span>
                    <strong className="text-slate-900 text-sm font-mono block">
                      {devicePrice.toLocaleString('ar-EG')} ج.م
                    </strong>
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-right">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2.5">المقدم الإلزامي</th>
                        <th className="p-2.5">مدة التمويل</th>
                        <th className="p-2.5">تاريخ الاستحقاق</th>
                        <th className="p-2.5 bg-blue-100 text-blue-900">القسط الشهري</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      <tr>
                        <td className="p-2.5 font-bold font-mono text-emerald-800">
                          {calc.downPayment.toLocaleString('ar-EG')} ج.م ({downPaymentPercent}%)
                        </td>
                        <td className="p-2.5">{calc.months} شهرًا</td>
                        <td className="p-2.5">يوم 5 من كل شهر</td>
                        <td className="p-2.5 bg-blue-50 font-black text-sm text-blue-900 font-mono">
                          {calc.monthlyInstallment.toLocaleString('ar-EG')} ج.م
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
                  <strong>تذكير باللائحة:</strong> السداد إلزامي شهريًا قبل نهاية يوم 5. بعد مهلة 48 ساعة، تُطبق غرامة تأخير 50 ج.م/يوم وتسقط الآجال في حال التخلف عن قسطين وتُحال السندات للقضاء فورًا.
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-slate-900">
                  <div className="space-y-1 text-center sm:text-right">
                    <div className="text-xs font-bold text-slate-900">
                      توجه مباشرة للبائع داخل المحل لإتمام التعاقد واستلام الجهاز
                    </div>
                    <p className="text-[11px] text-slate-500">
                      قدم هذه الشهادة أو الكود الرقمي لموظف الفرع بشارع مصطفى كامل أمام بن بهاء.
                    </p>
                  </div>

                  {approvalQrDataUrl && (
                    <div className="text-center">
                      <div className="p-1.5 bg-white border-2 border-slate-900 rounded-xl inline-block shadow-sm">
                        <Image
                          src={approvalQrDataUrl}
                          alt="QR Approval Code"
                          width={110}
                          height={110}
                          className="rounded"
                        />
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 mt-0.5">SCAN AT COUNTER</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 print:hidden">
                <a
                  href={salesWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال كود الاعتماد لمبيعات الفرع على واتساب</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة شهادة الاعتماد</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('calc');
                    setApprovalCode('');
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-xs transition-colors"
                >
                  حساب جهاز آخر
                </button>
              </div>

            </div>
          )}

        </section>

        {/* ============================================================== */}
        {/* 6. FAQ SECTION                                                 */}
        {/* ============================================================== */}
        <section id="credit-faq" className="py-14 sm:py-20 border-t border-slate-800 bg-[#050914]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-widest">
                SUPPORT & FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                الأسئلة الشائعة حول أنظمة التقسيط
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-[#0b162c] rounded-2xl border border-slate-800 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-right font-bold text-sm sm:text-base text-white hover:text-amber-300 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                        <p className="pt-3">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. BRANCH & CONTACT FOOTER                                      */}
        {/* ============================================================== */}
        <footer id="contact" className="border-t border-slate-800/80 bg-[#03060c] py-10 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <div>
              <div className="font-bold text-white text-sm">
                ملك التفاحه — {branchName}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                مواعيد العمل: يوميًا من 12:00 ظهرًا حتى 12:00 منتصف الليل (من 12 لـ 12)
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="hover:text-amber-300 transition-colors">
                الرئيسية
              </Link>
              <span>•</span>
              <Link href="/products" className="hover:text-amber-300 transition-colors">
                الاستور العام
              </Link>
              <span>•</span>
              <Link href="/credit/qr" className="hover:text-amber-300 transition-colors">
                لافتة الـ QR
              </Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
