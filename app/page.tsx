import { StorefrontMotion } from '@/components/home/StorefrontMotion';
import { HeroSection } from '@/components/home/HeroSection';
import { ValueProposition } from '@/components/home/ValueProposition';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { WhatsAppSection } from '@/components/home/WhatsAppSection';
import { AccessoryDepartments } from '@/components/catalog/AccessoryDepartments';
import { ProductShelf } from '@/components/home/ProductShelf';
import { ShoppingGuide } from '@/components/home/ShoppingGuide';
import { getFeaturedProducts, getPublishedProducts, getCatalogBrands } from '@/lib/catalog/queries';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';
import { MessageCircle } from 'lucide-react';

// Read current ERP publication decisions on every request.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, phones, accessories, brands] = await Promise.allSettled([
    getFeaturedProducts(4),
    getPublishedProducts({ productType: 'phone', limit: 8, sort: 'newest', page: 1, availability: 'all' }),
    getPublishedProducts({ productType: 'accessory', limit: 4, sort: 'newest', page: 1, availability: 'all' }),
    getCatalogBrands(),
  ]);
  const latestPhones = phones.status === 'fulfilled' ? phones.value.products : [];
  const latestAccessories = accessories.status === 'fulfilled' ? accessories.value.products : [];
  const featuredProducts = featured.status === 'fulfilled' ? featured.value : [];
  const inventoryUnavailable = phones.status === 'rejected' && accessories.status === 'rejected' && featured.status === 'rejected';

  return (
    <StorefrontMotion>
      <HeroSection />
      <div className="shop-intro-strip"><span>ملك التفاحه</span><p>اختار براحتك. اسأل عن التفاصيل. واستلم من الفرع.</p><a href="#collections">ابدأ التسوق <span aria-hidden="true">←</span></a></div>
      <CategoryShowcase phones={latestPhones} />
      <BrandShowcase brands={brands.status === 'fulfilled' ? brands.value : []} />
      <ProductShelf id="featured" eyebrow="THE CURATED EDIT" title="اختيارات تستاهل نظرة." subtitle="منتجات مميزة من تشكيلة ملك التفاحه، بكل تفاصيلها." href="/products?featured=true" products={featuredProducts} featured />
      <ProductShelf id="latest-phones" eyebrow="FIND YOUR NEXT PHONE" title="هاتفك القادم، على ذوقك." subtitle="شوف الموديلات، قارن السعات والألوان، واعرف المتاح في الفروع." href="/products?productType=phone" products={latestPhones} />
      {inventoryUnavailable && <div className="shop-container inventory-notice" role="status"><div><strong>عايز تعرف المتاح دلوقتي؟</strong><p>تعذر تحميل قائمة المنتجات حاليًا. تواصل مع الفريق لتأكيد الموديلات والأسعار.</p></div><a className="shop-text-link" href={`https://wa.me/${sanitizeWhatsAppNumber()}?text=${encodeURIComponent('أهلًا، عايز أعرف الأجهزة والإكسسوارات المتاحة والأسعار الحالية.')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />اسأل عن التوافر</a></div>}
      <PromoBanner />
      <AccessoryDepartments />
      <ProductShelf id="accessories" eyebrow="MADE FOR YOUR EVERYDAY" title="التفاصيل اللي تكمّل يومك." subtitle="سماعات، شواحن وإكسسوارات. راجع المواصفات والتوافق مع جهازك." href="/products?productType=accessory" products={latestAccessories} />
      <ShoppingGuide />
      <ValueProposition />
      <WhatsAppSection />
    </StorefrontMotion>
  );
}
