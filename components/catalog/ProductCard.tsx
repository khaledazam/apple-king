import { InteractiveSurface } from '@/components/ui/MotionPrimitives';
import React from 'react';
import Link from 'next/link';
import Image from '@/components/ui/CatalogImage';
import { ChevronLeft, MessageCircle, Smartphone } from 'lucide-react';
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
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://store.mobilix.eg').replace(/\/+$/, '');
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
  const condition = product.variants?.every(v => v.condition === 'used') && product.variants.length ? 'مستعمل' : product.variants?.every(v => v.condition === 'new') && product.variants.length ? 'جديد' : null;
  return (
    <InteractiveSurface>
    <article className={'shop-product-card' + (featured ? ' shop-product-featured' : '')}>
      <div className="product-card-labels"><span>{product.brand}</span><span className={isOutOfStock ? 'product-stock-muted' : 'product-stock'}>{isOutOfStock ? 'غير متوفر' : product.isFeatured ? 'اختيار مميز' : 'متوفر'}</span></div>
      <Link href={'/products/' + product.slug} className="product-card-image" aria-label={'تفاصيل ' + (product.titleAr || product.title)}>
        {imageSrc ? <Image src={imageSrc} alt={product.titleAr || product.title} fill className="object-contain p-5" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px" /> : <div className="product-image-placeholder"><Smartphone size={64} strokeWidth={.8} /><span>الصورة غير متاحة</span></div>}
      </Link>
      <div className="product-card-colors">{availableColors.slice(0, 5).map(color => <span key={color} style={{ backgroundColor: getColorHex(color) }} title={color} />)}{availableColors.length > 5 && <small>+{availableColors.length - 5}</small>}</div>
      <Link href={'/products/' + product.slug}><h3>{product.titleAr || product.title}</h3></Link>
      <p className="product-card-model">{product.modelName || (product.productType === 'phone' ? 'هاتف ذكي' : 'إكسسوار')}</p>
      <div className="product-card-specs">{condition && <span>{condition}</span>}{storageOptions.slice(0, 2).map(storage => <span key={storage} dir="auto">{storage}</span>)}</div>
      <div className="product-card-bottom"><div className="product-card-price"><small>{product.requiresPriceConfirmation ? 'السعر حسب التوافر' : 'يبدأ من'}</small><strong>{product.requiresPriceConfirmation ? 'اسأل عن السعر' : formatEGP(hasPromo ? (product.promoPrice as number) : product.basePrice)}</strong>{hasPromo && <del>{formatEGP(product.basePrice)}</del>}</div><div className="product-card-actions"><Link href={'/products/' + product.slug} className="shop-text-link">التفاصيل <ChevronLeft size={15} /></Link><a href={inquiryUrl} target="_blank" rel="noopener noreferrer" aria-label={'استفسر عن ' + (product.titleAr || product.title) + ' عبر واتساب'} className="product-inquiry"><MessageCircle size={17} /></a></div></div>
    </article>
    </InteractiveSurface>
  );
}
