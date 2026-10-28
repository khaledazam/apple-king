import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MessageCircle } from 'lucide-react';
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
    '/branding/iphone-18-hero.jpg';

  // Build product inquiry WhatsApp URL
  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/products/${product.slug}`
      : `https://store.mobilix.eg/products/${product.slug}`;

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

  return (
    <div className="group relative rounded-[24px] bg-[#161617] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 sm:p-7">
      {/* Top Header: Eyebrow Tag & Product Name */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#86868b]">
          <span className="font-medium tracking-wide">{product.brand}</span>
          {isOutOfStock ? (
            <span className="text-[#86868b]">غير متوفر حاليًا</span>
          ) : product.isFeatured ? (
            <span className="text-[#f5f5f7] font-medium">مميز</span>
          ) : (
            <span className="text-[#2997ff]">متوفر بالفرع</span>
          )}
        </div>

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight group-hover:text-white transition-colors">
            {product.titleAr || product.title}
          </h3>
        </Link>

        <p className="text-xs text-[#86868b] line-clamp-1">
          {product.modelName || (product.productType === 'phone' ? 'هاتف ذكي معتمد' : 'إكسسوار أصلي')}
        </p>
      </div>

      {/* Center: Device Imagery with Generous Breathing Room */}
      <div className="my-6 relative aspect-square w-full flex items-center justify-center">
        <Link href={`/products/${product.slug}`} className="relative w-full h-full block">
          <Image
            src={imageSrc}
            alt={product.titleAr || product.title}
            fill
            className="object-contain object-center transform group-hover:scale-[1.03] transition-transform duration-500 ease-out p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          />
        </Link>
      </div>

      {/* Color Swatch Dots (Official Apple Style) */}
      {availableColors.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {availableColors.slice(0, 5).map((color, idx) => (
            <span
              key={idx}
              className="w-3 h-3 rounded-full border border-black/40 shadow-xs"
              style={{ backgroundColor: getColorHex(color) }}
              title={color}
            />
          ))}
          {availableColors.length > 5 && (
            <span className="text-[10px] text-[#86868b] font-mono">+{availableColors.length - 5}</span>
          )}
        </div>
      )}

      {/* Bottom Area: Pricing & Actions */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] text-[#86868b] block">يبدأ من</span>
          <span className="text-base sm:text-lg font-semibold text-[#f5f5f7] tracking-tight">
            {formatEGP(hasPromo ? (product.promoPrice as number) : product.basePrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick WhatsApp Inquiry CTA Button */}
          <a
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-btn-primary px-3.5 py-1.5 text-xs font-medium gap-1.5"
            title="حجز عبر واتساب"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حجز</span>
          </a>

          {/* Product Detail Link */}
          <Link
            href={`/products/${product.slug}`}
            className="w-8 h-8 rounded-full bg-[#1d1d1f] hover:bg-[#2b2b2d] flex items-center justify-center text-[#f5f5f7] transition-colors"
            title="عرض التفاصيل"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
