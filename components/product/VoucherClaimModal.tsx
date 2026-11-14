'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Ticket,
  X,
  Check,
  Copy,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  ChevronLeft,
  Loader2,
} from 'lucide-react';

interface VoucherClaimModalProps {
  productTitle: string;
  productSlug?: string;
  productPrice?: number;
}

interface PromoConfig {
  isActive: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount: number;
  validityDays: number;
  buttonText: string;
  badgeText: string;
  termsAr: string;
}

export function VoucherClaimModal({
  productTitle,
  productSlug,
  productPrice = 0,
}: VoucherClaimModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic promo configuration from ERP system
  const [promoConfig, setPromoConfig] = useState<PromoConfig | null>(null);

  // Result coupon state
  const [claimedCoupon, setClaimedCoupon] = useState<{
    code: string;
    customerName: string;
    customerPhone: string;
    productTitle: string;
    discountValue: number;
    calculatedDiscount: number;
    expiresAt: string;
  } | null>(null);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Fetch dynamic promotion settings from ERP on mount
  useEffect(() => {
    fetch('/api/public/coupons/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.setting) {
          setPromoConfig(data.data.setting);
        }
      })
      .catch((err) => console.warn('Could not load dynamic promo config:', err));
  }, []);

  // Compute values from dynamic settings
  const discountType = promoConfig?.discountType || 'percentage';
  const discountValue = promoConfig?.discountValue ?? 5;
  const maxCap = promoConfig?.maxDiscountAmount ?? 500;
  const buttonText = promoConfig?.buttonText || 'احصل على قسيمة خصم بالفرع';
  const badgeText = promoConfig?.badgeText || 'كوبون فوري';
  const termsText =
    promoConfig?.termsAr ||
    'يتم إبراز كود الخصم للكاشير عند الشراء بالفرع (السنبلاوين - شارع مصطفى كامل أمام بن بهاء). الخصم ساري لمدة 7 أيام من تاريخ الإصدار.';

  const estimatedDiscount =
    discountType === 'percentage'
      ? productPrice > 0
        ? Math.min(Math.round(productPrice * (discountValue / 100)), maxCap)
        : maxCap
      : discountValue;

  useEffect(() => {
    if (claimedCoupon?.code) {
      QRCode.toDataURL(claimedCoupon.code, {
        width: 180,
        margin: 1,
        color: {
          dark: '#060b18',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [claimedCoupon]);

  // If promo campaign is explicitly turned off from ERP, hide the button
  if (promoConfig && promoConfig.isActive === false) {
    return null;
  }

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('يرجى ملء جميع الحقول للمتابعة.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/public/coupons/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          productTitle,
          productSlug,
          productPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'فشل إصدار كود الخصم');
      }

      setClaimedCoupon(data.data.coupon);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (claimedCoupon?.code) {
      navigator.clipboard.writeText(claimedCoupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201097976407';
  const whatsappBookingUrl = claimedCoupon
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        `مرحباً ملك التفاحه (أحمد عبد العزيز)، قمت بحجز [${claimedCoupon.productTitle}] من الاستور الإلكتروني وحصلت على قسيمة خصم كود: [${claimedCoupon.code}] باسم [${claimedCoupon.customerName}]. سأتوجه للفرع بالسنبلاوين للمعاينة والاستلام.`
      )}`
    : `https://wa.me/${whatsappPhone}`;

  return (
    <>
      {/* Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-400/30 border-2 border-amber-400/60 text-slate-900 flex items-center justify-between gap-3 shadow-xs transition-all duration-200 active:scale-[0.99] cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1d1d1f]">{buttonText}</span>
              <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-md">
                {badgeText}
              </span>
            </div>
            <p className="text-xs text-[#6e6e73] mt-0.5">
              {discountType === 'percentage'
                ? `وفر حتى ${estimatedDiscount} ج.م كاش (${discountValue}%) عند الاستلام من فرع السنبلاوين`
                : `خصم فوري بقيمة ${estimatedDiscount} ج.م كاش عند الاستلام من فرع السنبلاوين`}
            </p>
          </div>
        </div>

        <ChevronLeft className="w-5 h-5 text-amber-700 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:hidden animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-[#0b1328] border-2 border-amber-400/50 rounded-3xl max-w-md w-full text-slate-100 shadow-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">قسيمة خصم الاستور المعتمدة</h3>
                  <p className="text-[11px] text-amber-300">ملك التفاحه — فرع السنبلاوين</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setClaimedCoupon(null);
                  setError(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!claimedCoupon ? (
                /* Step 1: Input Form */
                <form onSubmit={handleClaim} className="space-y-4">
                  {/* Selected Item Summary */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-400/30 space-y-1">
                    <span className="text-[11px] text-slate-400 block">الجهاز المحدد للحجز:</span>
                    <p className="font-bold text-sm text-white truncate">{productTitle}</p>
                    {productPrice > 0 && (
                      <div className="flex items-center justify-between text-xs pt-1 text-slate-300 border-t border-slate-800 mt-1.5">
                        <span>قيمة الخصم عند الاستلام:</span>
                        <span className="font-mono font-bold text-amber-400">
                          - {estimatedDiscount} ج.م
                        </span>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        الاسم ثلاثي (كما بالبطاقة)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="أدخل اسمك بالكامل..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        رقم الهاتف / الواتساب
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="مثال: 01012345678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors text-left font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Conditions Note */}
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-[11px] text-blue-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>شروط صرف القسيمة بالفرع:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {termsText}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>تأكيد الحجز واستلام الكوبون</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: The VIP Voucher Result */
                <div className="space-y-4 text-center">
                  
                  {/* The Royal Voucher Card */}
                  <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#0f1b3a] to-[#080e1f] border-2 border-amber-400 text-slate-100 shadow-xl space-y-3.5 overflow-hidden">
                    
                    {/* Watermark Tag */}
                    <div className="flex items-center justify-between border-b border-amber-400/30 pb-2.5">
                      <span className="text-[10px] font-black text-amber-400 tracking-wider">
                        ★ قسيمة خصم معتمدة ★
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        صالح حتى: {new Date(claimedCoupon.expiresAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    {/* QR Code */}
                    {qrDataUrl && (
                      <div className="w-28 h-28 mx-auto p-1.5 bg-white rounded-xl shadow-md flex items-center justify-center">
                        <img
                          src={qrDataUrl}
                          alt={`QR ${claimedCoupon.code}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Prominent Code */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">كود الخصم الخاص بك:</span>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/20 border-2 border-amber-400 text-amber-300 font-mono font-black text-2xl tracking-widest">
                        <span>{claimedCoupon.code}</span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="p-1 text-amber-400 hover:text-white transition-colors cursor-pointer"
                          title="نسخ الكود"
                        >
                          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                      {copied && (
                        <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                          تم نسخ الكود بنجاح!
                        </p>
                      )}
                    </div>

                    {/* Customer & Benefit Details */}
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 text-right">
                      <div className="flex justify-between text-slate-300">
                        <span>العميل:</span>
                        <strong className="text-white">{claimedCoupon.customerName}</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>الجهاز:</span>
                        <span className="text-white truncate max-w-[200px]">{claimedCoupon.productTitle}</span>
                      </div>
                      <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800 font-bold">
                        <span>قيمة الخصم عند الاستلام:</span>
                        <span>{claimedCoupon.calculatedDiscount} ج.م كاش</span>
                      </div>
                    </div>

                    {/* Branch Address Pill */}
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>السنبلاوين، شارع مصطفى كامل أمام بن بهاء</span>
                    </div>
                  </div>

                  {/* Actions: Send to WhatsApp & Done */}
                  <div className="space-y-2 pt-1">
                    <a
                      href={whatsappBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تأكيد الحجز وإرسال الكود للفرع عبر واتساب</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      إغلاق (سأحتفظ بالكود للمحل)
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
