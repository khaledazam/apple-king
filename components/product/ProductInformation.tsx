'use client';

import React, { useState } from 'react';
import { MessageCircle, AlertCircle, Share2, Check } from 'lucide-react';
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
  const initialVariant =
    product.variants && product.variants.length > 0 ? product.variants[0].variantKey : '';
  const [internalVariantKey, setInternalVariantKey] = useState(initialVariant);
  const [copied, setCopied] = useState(false);

  const activeVariantKey =
    controlledVariantKey !== undefined ? controlledVariantKey : internalVariantKey;
  const handleVariantSelect = (key: string) => {
    if (onVariantChange) {
      onVariantChange(key);
    } else {
      setInternalVariantKey(key);
    }
  };

  const selectedVariant =
    product.variants?.find((v) => v.variantKey === activeVariantKey) || product.variants?.[0];

  const currentPrice = selectedVariant?.price || product.basePrice;
  const currentPromo = selectedVariant?.promoPrice || product.promoPrice;
  const hasPromo =
    currentPromo && currentPromo < currentPrice && !product.requiresPriceConfirmation;

  const isOutOfStock =
    product.availabilityStatus === 'out_of_stock' || product.totalAvailableQuantity === 0;

  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' ج.م';
  };

  const productUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://store.mobilix.eg/products/${product.slug}`;

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
    <div className="space-y-8">
      {/* Official Apple Store Header: Eyebrow & Share */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#86868b]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#f5f5f7]">{product.brand}</span>
            <span>•</span>
            <span>{product.productType === 'phone' ? 'هاتف ذكي' : 'إكسسوار أصلي'}</span>
            {product.isFeatured && (
              <>
                <span>•</span>
                <span className="text-[#2997ff]">إصدار مميز</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 text-[#86868b] hover:text-[#f5f5f7] transition-colors flex items-center gap-1.5 text-xs"
            title="مشاركة رابط المنتج"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2997ff]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'مشاركة'}</span>
          </button>
        </div>

        {/* Main Product Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#f5f5f7] tracking-tight leading-tight">
          {product.titleAr || product.title}
        </h1>

        {product.descriptionAr && (
          <p className="text-sm text-[#86868b] leading-relaxed pt-1">
            {product.descriptionAr}
          </p>
        )}
      </div>

      {/* Official Apple Price Stack */}
      <div className="py-4 border-y border-white/[0.08] flex items-baseline justify-between">
        <div>
          <span className="text-xs text-[#86868b] block">سعر البيع كاش</span>
          <div className="pt-1">
            {product.requiresPriceConfirmation ? (
              <span className="text-lg font-medium text-[#2997ff]">السعر يحتاج تأكيد المبيعات</span>
            ) : hasPromo ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-[#f5f5f7] tracking-tight">
                  {formatEGP(currentPromo as number)}
                </span>
                <span className="text-base line-through text-[#86868b]">
                  {formatEGP(currentPrice)}
                </span>
              </div>
            ) : (
              <span className="text-3xl sm:text-4xl font-semibold text-[#f5f5f7] tracking-tight">
                {formatEGP(currentPrice)}
              </span>
            )}
          </div>
        </div>

        <span className="text-xs text-[#86868b]">شامل الضمان المعتمد</span>
      </div>

      {/* Out of Stock Notice (Apple Style) */}
      {isOutOfStock && (
        <div className="p-4 rounded-2xl bg-[#1d1d1f] border border-white/[0.08] text-xs text-[#86868b] flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#86868b]" />
          <span>هذا الموديل غير متوفر حاليًا بالفرع. يمكنك الاستفسار عن موعد الشحنة القادمة عبر واتساب.</span>
        </div>
      )}

      {/* Official Apple Variant Configuration Flow */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariantKey={activeVariantKey}
          onSelectVariant={handleVariantSelect}
        />
      )}

      {/* Official Apple Store Primary CTA (Blue Pill) */}
      <div className="space-y-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-base flex items-center justify-center gap-2.5 shadow-sm transition-all duration-200 active:scale-[0.99]"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{isOutOfStock ? 'اسأل عن التوفر عبر واتساب' : 'استفسر واحجز عبر واتساب'}</span>
        </a>

        <p className="text-[11px] text-center text-[#86868b]">
          تواصل مباشر مع مبيعات فروع APPLE KING • استلام فوري ومعاينة كاملة للجهاز بالفرع
        </p>
      </div>

      {/* Apple Specifications Block */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="pt-6 border-t border-white/[0.08] space-y-3">
          <h3 className="text-sm font-semibold text-[#f5f5f7]">المواصفات الفنية المعتمدة</h3>
          <div className="rounded-2xl border border-white/[0.08] bg-[#161617] divide-y divide-white/[0.06] text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between p-3.5">
                <span className="text-[#86868b] font-normal">{key}</span>
                <span className="text-[#f5f5f7] font-medium font-mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
