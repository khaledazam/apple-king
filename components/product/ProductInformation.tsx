'use client';

import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, Sparkles, AlertCircle, Share2, Check } from 'lucide-react';
import { PublicCatalogProduct } from '@/types/catalog';
import { VariantSelector } from './VariantSelector';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

interface ProductInformationProps {
  product: PublicCatalogProduct;
  selectedVariantKey?: string;
  onVariantChange?: (variantKey: string) => void;
}

export function ProductInformation({
  product,
  selectedVariantKey: controlledVariantKey,
  onVariantChange,
}: ProductInformationProps) {
  const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0].variantKey : '';
  const [internalVariantKey, setInternalVariantKey] = useState(initialVariant);
  const [copied, setCopied] = useState(false);

  const activeVariantKey = controlledVariantKey !== undefined ? controlledVariantKey : internalVariantKey;
  const handleVariantSelect = (key: string) => {
    if (onVariantChange) {
      onVariantChange(key);
    } else {
      setInternalVariantKey(key);
    }
  };

  const selectedVariant = product.variants?.find((v) => v.variantKey === activeVariantKey) || product.variants?.[0];

  const currentPrice = selectedVariant?.price || product.basePrice;
  const currentPromo = selectedVariant?.promoPrice || product.promoPrice;
  const hasPromo = currentPromo && currentPromo < currentPrice && !product.requiresPriceConfirmation;

  const isOutOfStock = product.availabilityStatus === 'out_of_stock' || product.totalAvailableQuantity === 0;

  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' ج.م';
  };

  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://store.mobilix.eg/products/${product.slug}`;

  // WhatsApp inquiry URL generator
  const whatsappUrl = buildWhatsAppInquiryUrl({
    productName: product.titleAr || product.title,
    price: hasPromo ? (currentPromo as number) : currentPrice,
    variantDescription: selectedVariant
      ? `${selectedVariant.storage || ''} ${selectedVariant.color || ''}`.trim()
      : undefined,
    productUrl,
  });

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Category Breadcrumb Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase font-mono bg-neutral-900 text-[#D6AC63] border border-[#D6AC63]/30 tracking-wider">
            {product.brand}
          </span>
          <span className="text-xs text-neutral-400 font-medium">
            {product.productType === 'phone' ? 'هاتف ذكي' : 'إكسسوار أصلي'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors flex items-center gap-1.5 text-xs"
          title="مشاركة رابط المنتج"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'تم النسخ' : 'مشاركة'}</span>
        </button>
      </div>

      {/* Main Title Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          {product.titleAr || product.title}
        </h1>
        {product.descriptionAr && (
          <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
            {product.descriptionAr}
          </p>
        )}
      </div>

      {/* Pricing Block */}
      <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-neutral-800/90 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-neutral-400 font-semibold">السعر المعتمد كاش:</span>
          <div className="text-left font-mono">
            {product.requiresPriceConfirmation ? (
              <div className="space-y-1 text-right">
                <span className="text-lg font-bold text-amber-400">السعر يحتاج تأكيد المبيعات</span>
                <p className="text-[11px] text-neutral-400">
                  نظراً لاختلاف الأسعار بين الفروع، يُرجى التواصل عبر الواتساب لتأكيد السعر المعتمد فوراً.
                </p>
              </div>
            ) : hasPromo ? (
              <div className="flex items-baseline gap-3">
                <span className="text-sm line-through text-neutral-500">
                  {formatEGP(currentPrice)}
                </span>
                <span className="text-3xl font-black text-emerald-400">
                  {formatEGP(currentPromo as number)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-black text-white">
                {formatEGP(currentPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Out of Stock Notice */}
        {isOutOfStock && (
          <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>نفد المخزون حاليًا من هذا الموديل. يمكنك الاستفسار عن موعد توفره أو البدائل المتاحة.</span>
          </div>
        )}
      </div>

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariantKey={activeVariantKey}
          onSelectVariant={handleVariantSelect}
        />
      )}

      {/* Primary WhatsApp Inquiry CTA Button */}
      <div className="pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-950 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{isOutOfStock ? 'اسأل عن التوفر عبر واتساب' : 'استفسر واحجز عبر واتساب'}</span>
        </a>
        <p className="text-[11px] text-center text-neutral-500 mt-2">
          طلب مباشر وسريع مع خدمة عملاء فروع APPLE KING • لا يتطلب بطاقة ائتمان
        </p>
      </div>

      {/* Specifications Block */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D6AC63]" />
            المواصفات الفنية المعتمدة
          </h3>
          <div className="rounded-2xl border border-neutral-800 bg-[#0B0B0B] divide-y divide-neutral-800/80 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between p-3">
                <span className="text-neutral-400 font-medium">{key}</span>
                <span className="text-neutral-200 font-semibold font-mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
