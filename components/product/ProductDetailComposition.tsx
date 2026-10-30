'use client';

import React, { useState } from 'react';
import { PublicCatalogProduct } from '@/types/catalog';
import { ProductGallery } from './ProductGallery';
import { ProductInformation } from './ProductInformation';
import { BranchAvailabilityCard } from './BranchAvailabilityCard';
import { MessageCircle, ShieldAlert } from 'lucide-react';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

interface ProductDetailCompositionProps {
  product: PublicCatalogProduct;
}

export function ProductDetailComposition({ product }: ProductDetailCompositionProps) {
  const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0].variantKey : '';
  const [selectedVariantKey, setSelectedVariantKey] = useState(initialVariant);

  const selectedVariant =
    product.variants?.find((v) => v.variantKey === selectedVariantKey) || product.variants?.[0];

  const selectedColor = selectedVariant?.color;
  const currentPrice = selectedVariant?.price || product.basePrice;
  const currentPromo = selectedVariant?.promoPrice || product.promoPrice;
  const hasPromo = currentPromo && currentPromo < currentPrice && !product.requiresPriceConfirmation;
  const isOutOfStock =
    (selectedVariant ? selectedVariant.availableQuantity === 0 : false) ||
    product.availabilityStatus === 'out_of_stock' ||
    product.totalAvailableQuantity === 0;

  // Variant-specific branch availability fallback to product branch availability
  const activeBranchAvailability =
    selectedVariant?.branchAllocations && selectedVariant.branchAllocations.length > 0
      ? selectedVariant.branchAllocations
      : product.branchAvailability;

  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://store.mobilix.eg/products/${product.slug}`;

  const stickyWhatsAppUrl = buildWhatsAppInquiryUrl({
    productName: product.titleAr || product.title,
    price: hasPromo ? (currentPromo as number) : currentPrice,
    variantDescription: selectedVariant
      ? `${selectedVariant.storage || ''} ${selectedVariant.color || ''}`.trim()
      : undefined,
    productUrl,
  });

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Gallery & Store Availability Column */}
        <div className="lg:col-span-6 space-y-6">
          <ProductGallery
            images={product.images}
            productTitle={product.titleAr || product.title}
            media={product.media}
            selectedColor={selectedColor}
          />

          <BranchAvailabilityCard
            branchAvailability={activeBranchAvailability}
            lastInventorySync={product.lastInventorySync}
          />
        </div>

        {/* Product Info & Apple Store Buy Flow Controls */}
        <div className="lg:col-span-6">
          <ProductInformation
            product={product}
            selectedVariantKey={selectedVariantKey}
            onVariantChange={setSelectedVariantKey}
          />
        </div>
      </div>

      {/* Sticky Mobile Apple Action Bar */}
      <div className="lg:hidden fixed bottom-0 right-0 left-0 z-40 bg-white/95 backdrop-blur-xl border-t border-black/[0.08] p-3 px-4 flex items-center justify-between gap-4 shadow-2xl pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#6e6e73] block">السعر المعتمد</span>
          <div className="text-sm font-semibold text-[#1d1d1f]">
            {product.requiresPriceConfirmation ? (
              <span className="text-amber-400 text-xs flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                تأكيد السعر
              </span>
            ) : hasPromo ? (
              <span className="text-emerald-400">
                {new Intl.NumberFormat('en-US').format(currentPromo as number)} ج.م
              </span>
            ) : (
              <span>{new Intl.NumberFormat('en-US').format(currentPrice)} ج.م</span>
            )}
          </div>
        </div>

        {isOutOfStock ? (
          <div className="flex-1 min-h-[44px] flex items-center justify-center py-2.5 px-4 rounded-full bg-black/[0.03] border border-black/[0.1] text-[#6e6e73] text-xs font-normal">
            غير متوفر حالياً
          </div>
        ) : (
          <a
            href={stickyWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span>طلب وحجز عبر واتساب</span>
          </a>
        )}
      </div>
    </div>
  );
}
