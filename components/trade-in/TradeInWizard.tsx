'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Zap,
  RotateCcw,
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

const POPULAR_MODELS = [
  'iPhone 16 Pro Max',
  'iPhone 16 Pro',
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 14 Pro Max',
  'iPhone 13 Pro Max',
  'iPhone 13',
  'iPhone 12 Pro Max',
  'iPhone 12',
  'iPhone 11',
  'Samsung S24 Ultra',
  'Samsung S23 Ultra',
];

const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];

const CONDITIONS = [
  { id: 'flawless', label: 'كسر زيرو فابريكا', desc: 'بدون أي خدوش أو علامات استخدام نهائياً' },
  { id: 'good', label: 'مستعمل نظيف جداً', desc: 'استخدام هادئ، علامات خفيفة جداً تكاد لا تُرَى' },
  { id: 'fair', label: 'مستعمل به خدوش', desc: 'خدوش واضحة في الهيكل أو الشاشة دون كسور' },
];

export function TradeInWizard() {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 13 Pro Max');
  const [customModel, setCustomModel] = useState('');
  const [storage, setStorage] = useState('256GB');
  const [batteryHealth, setBatteryHealth] = useState(86);
  const [condition, setCondition] = useState('good');
  const [screenCondition, setScreenCondition] = useState('original');
  const [hasBox, setHasBox] = useState(true);
  const [hasFaceId, setHasFaceId] = useState(true);

  // Evaluation states
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedModelName = customModel.trim() || model;

  const handleEstimate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/trade-in/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          model: selectedModelName,
          storage,
          batteryHealth,
          condition,
          screenCondition,
          hasBox,
          hasFaceId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'تعذر تقييم الجهاز حالياً');
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال بسيرفر التقييم');
    } finally {
      setIsLoading(false);
    }
  };

  // Build WhatsApp inquiry URL
  const formatEGP = (num: number) => new Intl.NumberFormat('en-US').format(num) + ' ج.م';

  const whatsappMessage = result
    ? `أهلًا ملك التفاحه (أحمد عبد العزيز)، عملت تقييم لهاتفي في أداة (تاخدوا جهازي بكام؟) على الاستور:
- الجهاز: ${selectedModelName} (${storage})
- نسبة البطارية: ${batteryHealth}%
- الحالة: ${condition === 'flawless' ? 'كسر زيرو' : condition === 'good' ? 'مستعمل نظيف' : 'مستعمل'}
- العلبة: ${hasBox ? 'موجودة' : 'بدون علبة'}
- السعر التقديري في دوبيزل: ${formatEGP(result.dubizzleAveragePrice)}
- السعر المتوقع للبدل أو البيع: ${formatEGP(result.estimatedTradeInMin)} إلى ${formatEGP(result.estimatedTradeInMax)}

عايز أعرف تفاصيل البيع أو الاستبدال بفرع السنبلاوين.`
    : '';

  const whatsappUrl = `https://wa.me/${sanitizeWhatsAppNumber()}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {/* ── Wizard Card ── */}
      <div className="bg-white rounded-3xl border border-[#e5e5ea] shadow-xl shadow-black/[0.04] p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-[#f0f0f2] pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8b66b]/10 border border-[#d8b66b]/30 text-[#856524] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مُثمّن الهواتف الذكي (NaraRouter AI)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
            تاخدوا جهازي بكام؟
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73]">
            حدّد مواصفات هاتفك وسيقوم الذكاء الاصطناعي بمطابقة حالته مع متوسط أسعار السوق وإعلانات دوبيزل (Dubizzle) في ثوانٍ.
          </p>
        </div>

        {/* ── Step 1: Model & Storage ── */}
        <div className="space-y-5">
          <label className="block text-sm font-bold text-[#1d1d1f]">
            1. اختر موديل هاتفك:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {POPULAR_MODELS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setModel(item);
                  setCustomModel('');
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                  model === item && !customModel
                    ? 'bg-[#1d1d1f] text-white shadow-md'
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-transparent'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="أو اكتب اسم الموديل يدوياً (مثال: iPhone 12 Mini أو Galaxy S22)..."
              className="w-full h-11 px-4 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7] text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#d8b66b]"
            />
          </div>
        </div>

        {/* ── Step 2: Storage Selection ── */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-[#1d1d1f]">
            2. المساحة التخزينية:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {STORAGE_OPTIONS.map((cap) => (
              <button
                key={cap}
                type="button"
                onClick={() => setStorage(cap)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  storage === cap
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]'
                }`}
              >
                {cap}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 3: Battery Health ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-[#1d1d1f]">
              3. نسبة صحة البطارية (Maximum Capacity):
            </label>
            <span className="text-sm font-mono font-bold text-[#b48a3c] bg-[#d8b66b]/10 px-3 py-1 rounded-lg">
              {batteryHealth}%
            </span>
          </div>
          <input
            type="range"
            min="65"
            max="100"
            value={batteryHealth}
            onChange={(e) => setBatteryHealth(Number(e.target.value))}
            className="w-full accent-[#b48a3c] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#86868b] font-mono">
            <span>65% (تحتاج تغيير)</span>
            <span>85% (جيدة)</span>
            <span>100% (جديدة)</span>
          </div>
        </div>

        {/* ── Step 4: Physical Condition ── */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-[#1d1d1f]">
            4. الحالة الخارجية للهاتف:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CONDITIONS.map((c) => (
              <div
                key={c.id}
                onClick={() => setCondition(c.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                  condition === c.id
                    ? 'border-[#b48a3c] bg-[#d8b66b]/5 shadow-sm'
                    : 'border-[#e5e5ea] bg-white hover:bg-[#fbfbfd]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1d1d1f]">{c.label}</span>
                  {condition === c.id && <CheckCircle2 className="w-4 h-4 text-[#b48a3c]" />}
                </div>
                <p className="text-[11px] text-[#86868b] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step 5: Parts & Box Details ── */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-[#1d1d1f]">
            5. المشتملات وقطع الغيار:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Box Toggle */}
            <button
              type="button"
              onClick={() => setHasBox(!hasBox)}
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                hasBox
                  ? 'border-emerald-500/50 bg-emerald-50/50 text-emerald-900'
                  : 'border-[#e5e5ea] bg-[#f5f5f7] text-[#6e6e73]'
              }`}
            >
              <span>العلبة الأصلية متوفرة</span>
              <Package className="w-4 h-4" />
            </button>

            {/* Screen Original Toggle */}
            <button
              type="button"
              onClick={() =>
                setScreenCondition(screenCondition === 'original' ? 'replaced' : 'original')
              }
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                screenCondition === 'original'
                  ? 'border-emerald-500/50 bg-emerald-50/50 text-emerald-900'
                  : 'border-amber-500/50 bg-amber-50/50 text-amber-900'
              }`}
            >
              <span>{screenCondition === 'original' ? 'الشاشة أصلية فابريكا' : 'الشاشة تم استبدالها'}</span>
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Face ID Toggle */}
            <button
              type="button"
              onClick={() => setHasFaceId(!hasFaceId)}
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                hasFaceId
                  ? 'border-emerald-500/50 bg-emerald-50/50 text-emerald-900'
                  : 'border-red-500/50 bg-red-50/50 text-red-900'
              }`}
            >
              <span>{hasFaceId ? 'بصمة الوجه (Face ID) تعمل' : 'الفيس آي دي معطل'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Submit Button ── */}
        <div className="pt-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleEstimate}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d0a753] to-[#f0d48a] hover:from-[#c59c47] hover:to-[#e2c478] text-[#221b0e] text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#d0a753]/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#221b0e] border-t-transparent rounded-full animate-spin" />
                <span>جاري تحليل أسعار دوبيزل والسوق بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>احسب سعر جهازي بالذكاء الاصطناعي ⚡</span>
              </>
            )}
          </button>
        </div>

        {/* ── Error Notification ── */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Valuation Results Box ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="mt-8 rounded-3xl bg-[#0b0c0f] text-white p-6 sm:p-8 space-y-6 border border-[#d8b66b]/30 shadow-2xl relative overflow-hidden"
            >
              {/* Golden Ambient Glow */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#d8b66b]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <span className="text-[11px] text-[#dfbd76] font-semibold tracking-wider block">
                    تقرير التقييم والتسعير التقديري
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {selectedModelName} — {storage}
                  </h3>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-neutral-300 font-mono">
                  صحة البطارية: {batteryHealth}%
                </div>
              </div>

              {/* Price Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dubizzle Benchmark Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs text-neutral-400 block flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#d8b66b]" />
                    <span>متوسط السعر المعروض على دوبيزل:</span>
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-neutral-200">
                    {formatEGP(result.dubizzleAveragePrice)}
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    متوسط أسعار الإعلانات الفردية للأجهزة المشابهة.
                  </p>
                </div>

                {/* Trade-In Shop Range Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#d0a753]/20 to-transparent border border-[#d0a753]/40 space-y-1">
                  <span className="text-xs text-[#f0d48a] font-bold block flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#f0d48a]" />
                    <span>السعر المقترح للشراء أو الاستبدال:</span>
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#f0d48a]">
                    {formatEGP(result.estimatedTradeInMin)} - {formatEGP(result.estimatedTradeInMax)}
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    نطاق استرشادي للبيع كاش أو ترقية لهاتف أحدث.
                  </p>
                </div>
              </div>

              {/* Factors */}
              {result.priceFactors && result.priceFactors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-neutral-300 block">
                    عوامل أثرت في التقييم:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.priceFactors.map((f: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── WhatsApp Action CTA ── */}
              <div className="pt-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0f776a] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform hover:scale-[1.01]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>تثبيت التقييم والتواصل على واتساب المحل (السنبلاوين)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* ── Crucial User-Requested Disclaimer ── */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>تنويه هام للعميل:</span>
                </div>
                <p>
                  {result.disclaimer ||
                    'ملاحظة: هذا التقييم تم بواسطة الذكاء الاصطناعي بناءً على متوسط أسعار السوق ودوبيزل في مصر، وهو سعر استرشادي تقريبي وليس له علاقة بالتسعير الرسمي النهائي داخل فرع المحل بعد الفحص الفعلي.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
