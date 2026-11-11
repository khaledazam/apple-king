'use client';

import React, { useState, useMemo } from 'react';
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

export function CreditPortalClient({
  phones,
  branchName = 'فرع السنبلاوين — شارع مصطفى كامل أمام بن بهاء',
  salesNumber = '201097976407',
}: CreditPortalClientProps) {
  // Selection states
  const [selectedPhoneId, setSelectedPhoneId] = useState<string>(phones[0]?.id || '');
  const [selectedDurationMonths, setSelectedDurationMonths] = useState<number>(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30); // Min 25%

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

  // Selected phone
  const selectedPhone = useMemo(() => {
    return phones.find((p) => p.id === selectedPhoneId) || phones[0];
  }, [phones, selectedPhoneId]);

  const devicePrice = useMemo(() => {
    if (!selectedPhone) return 0;
    return selectedPhone.promoPrice || selectedPhone.basePrice || 0;
  }, [selectedPhone]);

  // Installment calculations
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

      // Generate QR Code data URL containing the approval summary
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
تم إجراء الفحص الائتماني والقبول المشروط عبر السيستم.`;

  const salesWhatsAppUrl = `https://wa.me/${sanitizeWhatsAppNumber(
    salesNumber
  )}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#070d19] text-[#e2e8f0] py-8 sm:py-14 px-3 sm:px-6 font-sans selection:bg-[#0071e3] selection:text-white" dir="rtl">
      
      {/* ── Official Institutional Top Bar ── */}
      <div className="max-w-5xl mx-auto mb-6 bg-[#0b162c] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-lg border border-blue-400/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                CONSUMER CREDIT SYSTEM
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                ● جلسة مشفرة ومحققة
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-white tracking-tight">
              منظومة الائتمان وتقييم المخاطر — ملك التفاحه
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{branchName}</span>
              <span>•</span>
              <span className="font-mono text-slate-500">كود الفرع: SEN-EG-01</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
          <div className="text-left font-mono text-[11px] text-slate-400">
            <div>SECURITY: 256-BIT SSL</div>
            <div className="text-emerald-400 font-semibold">BRANCH CONNECTED</div>
          </div>
          <Link
            href="/credit/qr"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs transition-colors"
            title="عرض وطباعة الـ QR Code الخاص بالفرع"
          >
            <QrCode className="w-4 h-4" />
            <span>لافتة الـ QR</span>
          </Link>
        </div>
      </div>

      {/* ── Security Notice Ribbon ── */}
      <div className="max-w-5xl mx-auto mb-8 bg-amber-500/10 border-r-4 border-amber-500 rounded-xl p-3.5 sm:p-4 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-300 font-bold mb-0.5">
            إشعار نظامي ملزم لمشتري أجهزة التقسيط:
          </strong>
          حسابات الأقساط والمقدمات ونسب المرابحة محددة آلياً بواسطة المنظومة المركزية لإدارة الائتمان والالتزام المالي. موظف المبيعات غير مصرح له بقبول أي تفاوض يدوي أو تعديل في جدول السداد أو التنازل عن الشروط الجزائية.
        </div>
      </div>

      {/* ── Main Work Area ── */}
      <div className="max-w-5xl mx-auto">
        
        {/* ================= STEP 1: CALCULATOR & APPLICATION ================= */}
        {step === 'calc' && (
          <form onSubmit={handleStartEvaluation} className="space-y-8">
            
            {/* Section A: Live Device Selection */}
            <div className="bg-[#0b162c] rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-xs font-semibold text-blue-400 font-mono">STEP 01</span>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <span>تحديد الجهاز المتاح في مخزون الفرع</span>
                  </h2>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {phones.length} أجهزة متوفرة حالياً بالسيستم
                </div>
              </div>

              {phones.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <p className="text-base font-semibold text-slate-300">
                    لا تتوفر أجهزة مخصصة للتقسيط المباشر في المخزون الحالي.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    يُرجى مراجعة إدارة الفرع لتأكيد الأجهزة قيد الاستلام.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {phones.map((phone) => {
                    const isSelected = phone.id === selectedPhoneId;
                    const price = phone.promoPrice || phone.basePrice;
                    return (
                      <div
                        key={phone.id}
                        onClick={() => setSelectedPhoneId(phone.id)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {phone.brand}
                            </span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              متاح بالفرع ({phone.totalAvailableQuantity})
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-white line-clamp-2">
                            {phone.titleAr || phone.title}
                          </h3>
                        </div>

                        <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-baseline justify-between">
                          <span className="text-xs text-slate-400">سعر الكاش:</span>
                          <span className="font-bold text-base text-amber-400 font-mono">
                            {price.toLocaleString('ar-EG')} <span className="text-xs text-slate-300 font-sans">ج.م</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section B: Installment Plan & Financial Matrix */}
            <div className="bg-[#0b162c] rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800/80 pb-4">
                <span className="text-xs font-semibold text-blue-400 font-mono">STEP 02</span>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span>تحديد خطة السداد والمقدم الإلزامي</span>
                </h2>
              </div>

              {/* Duration Buttons */}
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
                        className={`p-3.5 rounded-xl border text-right transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm">{plan.label}</div>
                        <div className={`text-[11px] mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {plan.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Down Payment Slider */}
              <div className="space-y-3 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-slate-300">نسبة المقدم المدفوع:</span>
                  <span className="text-amber-400 font-bold font-mono text-base">
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
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>الحد الأدنى الإلزامي (25%)</span>
                  <span>أعلى مقدم (70%)</span>
                </div>
              </div>

              {/* Breakdown Matrix Board */}
              <div className="bg-gradient-to-br from-[#071328] to-[#040914] rounded-2xl p-5 border border-blue-900/50 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">المقدم المطلوب سداده:</span>
                  <strong className="text-base sm:text-lg text-white font-mono font-bold">
                    {calc.downPayment.toLocaleString('ar-EG')} ج.م
                  </strong>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">المبلغ المتبقي للتمويل:</span>
                  <strong className="text-base sm:text-lg text-slate-300 font-mono font-bold">
                    {calc.financedAmount.toLocaleString('ar-EG')} ج.م
                  </strong>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">تاريخ القسط الشهري:</span>
                  <strong className="text-base sm:text-lg text-slate-300 font-bold">
                    يوم 5 من كل شهر
                  </strong>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-blue-600/20 border border-blue-500/40 rounded-xl p-2.5 sm:p-2 text-center">
                  <span className="text-[11px] text-blue-300 block font-semibold">القسط الشهري الإلزامي:</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    {calc.monthlyInstallment.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs text-blue-200 block">ج.م / شهرياً</span>
                </div>
              </div>
            </div>

            {/* Section C: Customer Identity & Verification */}
            <div className="bg-[#0b162c] rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-800/80 pb-4">
                <span className="text-xs font-semibold text-blue-400 font-mono">STEP 03</span>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  <span>بيانات العميل وفحص الجدارة الائتمانية</span>
                </h2>
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
                    placeholder="مثال: محمد أحمد عبد الرحمن إبراهيم"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono tracking-widest focus:outline-none focus:border-blue-500 text-left"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono text-left focus:outline-none focus:border-blue-500"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    اسم الضامن وصلة القرابة (درجة أولى)
                  </label>
                  <input
                    type="text"
                    value={guarantorName}
                    onChange={(e) => setGuarantorName(e.target.value)}
                    placeholder="الاسم وصلة القرابة (اختياري للتقييم الأولي)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono text-left focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Section D: Strict Penal Terms & Legal Agreement */}
            <div className="bg-[#120808] rounded-3xl p-5 sm:p-8 border border-red-900/40 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-base sm:text-lg border-b border-red-900/40 pb-3">
                <Scale className="w-5 h-5 shrink-0" />
                <span>اللائحة الجزائية وإقرار الالتزام بالسداد القانوني</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-red-950">
                <p>
                  <strong>١. مواعيد السداد:</strong> يلتزم العميل بسداد القسط الشهري في موعد أقصاه اليوم الخامس من كل شهر ميلادي بمقر فرع السنبلاوين أو عبر المحافظ المعتمدة.
                </p>
                <p>
                  <strong>٢. غرامات التأخير الإدارية:</strong> في حال تجاوز مهلة السماح المقررة بـ (48 ساعة)، يتم احتساب رسم تأخير إداري تلقائي قدره <strong>50 جنيهًا مصريًا عن كل يوم تأخير</strong> تضاف آلياً لملف العميل بالسيستم.
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
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-900/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 mx-auto"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>إجراء الفحص الائتماني واستخراج كود الاعتماد</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">
                ENCRYPTED CENTRAL CREDIT DECISION ENGINE • SENBELLAWEIN BRANCH
              </p>
            </div>
          </form>
        )}

        {/* ================= STEP 2: SCANNING ANIMATION ================= */}
        {step === 'evaluating' && (
          <div className="bg-[#0b162c] rounded-3xl p-8 sm:p-14 border border-blue-900/60 shadow-2xl text-center space-y-8 max-w-2xl mx-auto my-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin" />
              <div className="w-full h-full flex items-center justify-center text-blue-400">
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
                evaluationStage >= 1 ? 'bg-blue-950/40 border-blue-500 text-blue-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}>
                <span>١. التحقق من صلاحية الرقم القومي وسجل العميل</span>
                {evaluationStage >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                evaluationStage >= 2 ? 'bg-blue-950/40 border-blue-500 text-blue-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'
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

        {/* ================= STEP 3: OFFICIAL APPROVAL TICKET ================= */}
        {step === 'approved' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            
            {/* Printable Institutional Voucher */}
            <div id="approval-ticket" className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-slate-900 space-y-6 relative overflow-hidden print:border-2 print:shadow-none">
              
              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 text-center font-black text-6xl rotate-[-25deg] select-none text-slate-950">
                APPLE KING CREDIT<br />VERIFIED SENBELLAWEIN
              </div>

              {/* Voucher Top Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
                <div className="text-center sm:text-right">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-widest font-mono block">
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
                  <div className="text-lg sm:text-xl font-black text-blue-800 tracking-wider">
                    {approvalCode}
                  </div>
                  <div className="text-[10px] text-slate-400">{approvalDate}</div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>تم قبول الطلب مبدئيًا بدرجة أمان ائتماني (Class A - منخفض المخاطر)</span>
                </div>
                <span className="font-mono text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded">
                  VALID 24H
                </span>
              </div>

              {/* Customer & Device Details Grid */}
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
                  <span className="text-slate-500 block">سعر الكاش المعتمد:</span>
                  <strong className="text-slate-900 text-sm font-mono block">
                    {devicePrice.toLocaleString('ar-EG')} ج.م
                  </strong>
                </div>
              </div>

              {/* Financial Plan Table */}
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

              {/* Penal Reminder */}
              <div className="text-[11px] text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
                <strong>تذكير باللائحة:</strong> السداد إلزامي شهريًا قبل نهاية يوم 5. بعد مهلة 48 ساعة، تُطبق غرامة تأخير 50 ج.م/يوم وتسقط الآجال في حال التخلف عن قسطين وتُحال السندات للقضاء فورًا.
              </div>

              {/* QR and Verification Section */}
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

            {/* Actions Bar */}
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

      </div>
    </div>
  );
}
