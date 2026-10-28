import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ShieldAlert, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { PublicCatalogProduct } from '@/types/catalog';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: PublicCatalogProduct;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const isOutOfStock = product.availabilityStatus === 'out_of_stock' || product.totalAvailableQuantity === 0;
  const hasPromo = product.promoPrice && product.promoPrice < product.basePrice && !product.requiresPriceConfirmation;

  // Format Egyptian Pound
  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' ج.م';
  };

  // Image source: coverImage or first images item or fallback
  const imageSrc =
    product.coverImage ||
    (product.images && product.images.length > 0 ? product.images[0] : null) ||
    '/branding/iphone-18-hero.jpg';

  // Build product inquiry WhatsApp URL
  const productUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/products/${product.slug}`
    : `https://store.mobilix.eg/products/${product.slug}`;

  const inquiryUrl = buildWhatsAppInquiryUrl({
    productName: product.titleAr || product.title,
    price: hasPromo ? (product.promoPrice as number) : product.basePrice,
    productUrl,
  });

  return (
    <div
      className={`group relative rounded-3xl bg-[#111111] border border-neutral-800/90 hover:border-[#D6AC63]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#D6AC63]/5 ${
        featured ? 'ring-1 ring-[#D6AC63]/30' : ''
      }`}
    >
      {/* Top Media Image Area */}
      <div className="relative aspect-square w-full bg-neutral-950 p-6 flex items-center justify-center overflow-hidden">
        {/* Badges Container */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10 pointer-events-none">
          {/* Brand Tag */}
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-neutral-900/90 text-neutral-300 border border-neutral-700/60 uppercase font-mono tracking-wider">
            {product.brand}
          </span>

          {/* Availability / Promo Badge */}
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-neutral-900/90 text-rose-400 border border-rose-900/40">
              غير متوفر حاليًا
            </span>
          ) : product.requiresPriceConfirmation ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/50 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              تأكيد السعر
            </span>
          ) : hasPromo ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-600 text-white shadow-md">
              عرض خاص
            </span>
          ) : product.isFeatured ? (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#D6AC63]/20 text-[#F1D49A] border border-[#D6AC63]/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              مميز
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              متوفر
            </span>
          )}
        </div>

        {/* Product Image Link */}
        <Link href={`/products/${product.slug}`} className="relative w-full h-full block">
          <Image
            src={imageSrc}
            alt={product.titleAr || product.title}
            fill
            className="object-contain object-center transform group-hover:scale-105 transition-transform duration-500 ease-out p-2"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>{product.modelName || product.category}</span>
            {product.variants && product.variants.length > 0 && product.variants[0].storage && (
              <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                {product.variants[0].storage}
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#F1D49A] transition-colors">
            <h3 className="text-base font-bold text-white line-clamp-1 leading-snug">
              {product.titleAr || product.title}
            </h3>
          </Link>
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-neutral-800/70 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-neutral-400 font-medium">السعر المعتمد:</span>
            <div className="text-left font-mono">
              {product.requiresPriceConfirmation ? (
                <span className="text-xs font-semibold text-amber-400">يُحدد عند الطلب</span>
              ) : hasPromo ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs line-through text-neutral-500">
                    {formatEGP(product.basePrice)}
                  </span>
                  <span className="text-lg font-black text-white text-emerald-400">
                    {formatEGP(product.promoPrice as number)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-black text-white">
                  {formatEGP(product.basePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/products/${product.slug}`}
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-200 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
            >
              <span>التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>

            <a
              href={inquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-950"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
