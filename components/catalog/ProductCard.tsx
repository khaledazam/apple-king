'use client';

import React from 'react';
import Link from 'next/link';
import Image from '@/components/ui/CatalogImage';
import { ChevronLeft, MessageCircle, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PublicCatalogProduct } from '@/types/catalog';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: PublicCatalogProduct;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const isOutOfStock =
    product.availabilityStatus === 'out_of_stock' || product.totalAvailableQuantity === 0;
  const hasPromo =
    product.promoPrice && product.promoPrice < product.basePrice && !product.requiresPriceConfirmation;

  // Format Egyptian Pound
  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' ج.م';
  };

  // Image source: coverImage or first images item or fallback
  const imageSrc =
    product.coverImage ||
    (product.images && product.images.length > 0 ? product.images[0] : null) ||
    null;

  // Build product inquiry WhatsApp URL
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king.com').replace(/\/+$/, '');
  const productUrl = `${appUrl}/products/${product.slug}`;

  const inquiryUrl = buildWhatsAppInquiryUrl({
    productName: product.titleAr || product.title,
    price: hasPromo ? (product.promoPrice as number) : product.basePrice,
    productUrl,
  });

  // Extract distinct colors for Apple-style finish dots
  const availableColors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  ) as string[];

  // Helper to map Arabic color names to authentic Apple finish hexes
  const getColorHex = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('أسود') || n.includes('black')) return '#2b2c2e';
    if (n.includes('تيتانيوم') || n.includes('natural')) return '#9a958e';
    if (n.includes('أبيض') || n.includes('white')) return '#e3e4e6';
    if (n.includes('صحراوي') || n.includes('desert') || n.includes('ذهبي') || n.includes('gold')) return '#cbb7a2';
    if (n.includes('أزرق') || n.includes('blue')) return '#39424c';
    if (n.includes('بنفسجي') || n.includes('purple')) return '#645d73';
    if (n.includes('أخضر') || n.includes('green')) return '#404c40';
    if (n.includes('وردي') || n.includes('pink')) return '#e8c4c4';
    if (n.includes('أحمر') || n.includes('red')) return '#b83b3b';
    return '#86868b';
  };

  const storageOptions = Array.from(new Set(product.variants?.map(v => v.storage).filter(Boolean)));
  const condition = product.variants?.every(v => v.condition === 'used') && product.variants.length ? 'مستعمل كسر زيرو' : product.variants?.every(v => v.condition === 'new') && product.variants.length ? 'جديد متبرشم' : null;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`shop-product-card group relative flex flex-col justify-between transition-all duration-300 hover:border-[#d8b66b]/60 hover:shadow-[0_20px_40px_-15px_rgba(216,182,107,0.22)] ${
        featured ? 'shop-product-featured ring-1 ring-[#e8c987]/30' : ''
      }`}
    >
      {/* Top Labels */}
      <div>
        <div className="product-card-labels flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">{product.brand}</span>
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isOutOfStock
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : product.isFeatured
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {!isOutOfStock && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            )}
            {isOutOfStock ? 'غير متوفر' : product.isFeatured ? 'اختيار مميز' : 'متوفر بالفرع'}
          </span>
        </div>

        {/* Product Image with smooth hover scale */}
        <Link
          href={'/products/' + product.slug}
          className="product-card-image relative block aspect-square overflow-hidden rounded-2xl bg-[#fafafc] mb-3 group/img"
          aria-label={'تفاصيل ' + (product.titleAr || product.title)}
        >
          {imageSrc ? (
            <div className="w-full h-full p-4 transition-transform duration-500 ease-out group-hover/img:scale-108 group-hover/img:-rotate-1">
              <Image
                src={imageSrc}
                alt={product.titleAr || product.title}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              />
            </div>
          ) : (
            <div className="product-image-placeholder h-full flex flex-col items-center justify-center gap-2 text-neutral-400 transition-colors group-hover/img:text-[#b88d40]">
              <Smartphone size={56} strokeWidth={0.8} />
              <span className="text-[11px] font-medium">ملك التفاحه</span>
            </div>
          )}
        </Link>

        {/* Apple Finish Dots */}
        {availableColors.length > 0 && (
          <div className="product-card-colors flex items-center justify-center gap-1.5 min-h-[22px] mb-3">
            {availableColors.slice(0, 5).map((color) => (
              <span
                key={color}
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
                className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner transition-transform hover:scale-130"
              />
            ))}
            {availableColors.length > 5 && <small className="text-[9px] text-[#86868b]">+{availableColors.length - 5}</small>}
          </div>
        )}

        {/* Title */}
        <Link href={'/products/' + product.slug} className="block group/title">
          <h3 className="text-sm sm:text-base font-bold text-[#1d1d1f] group-hover/title:text-[#b88d40] transition-colors line-clamp-2 leading-snug">
            {product.titleAr || product.title}
          </h3>
        </Link>
        <p className="product-card-model text-[11px] text-[#86868b] mt-1 font-medium">
          {product.modelName || (product.productType === 'phone' ? 'هاتف ذكي معتمد' : 'إكسسوار أصلي')}
        </p>

        {/* Specs Badges */}
        <div className="product-card-specs flex flex-wrap gap-1.5 my-3">
          {condition && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {condition}
            </span>
          )}
          {storageOptions.slice(0, 2).map((storage) => (
            <span key={storage} dir="auto" className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
              {storage}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer (Price & Actions) */}
      <div className="product-card-bottom pt-3 mt-3 border-t border-[#f0f0f4] flex items-center justify-between">
        <div className="product-card-price">
          <small className="block text-[10px] text-[#86868b] font-medium">
            {product.requiresPriceConfirmation ? 'السعر حسب التوافر' : 'يبدأ من'}
          </small>
          <div className="flex items-baseline gap-2">
            <strong className="text-base sm:text-lg font-black text-[#1d1d1f] tracking-tight">
              {product.requiresPriceConfirmation ? 'استفسر الآن' : formatEGP(hasPromo ? (product.promoPrice as number) : product.basePrice)}
            </strong>
            {hasPromo && <del className="text-xs text-[#86868b] font-normal">{formatEGP(product.basePrice)}</del>}
          </div>
        </div>

        <div className="product-card-actions flex items-center gap-2">
          <Link
            href={'/products/' + product.slug}
            className="text-xs font-bold text-[#0071e3] hover:text-[#0077ed] flex items-center gap-0.5 transition-colors pl-1"
          >
            <span>التفاصيل</span>
            <ChevronLeft size={14} />
          </Link>

          <motion.a
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'استفسر عن ' + (product.titleAr || product.title) + ' عبر واتساب'}
            className="w-9 h-9 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs"
          >
            <MessageCircle size={18} />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}
