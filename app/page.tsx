import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { ValueProposition } from '@/components/home/ValueProposition';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { WhatsAppSection } from '@/components/home/WhatsAppSection';
import { ProductCard } from '@/components/catalog/ProductCard';
import {
  getFeaturedProducts,
  getPublishedProducts,
  getCatalogBrands,
} from '@/lib/catalog/queries';
import { ChevronLeft, Sparkles, Smartphone, Headphones } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  // Concurrently fetch catalog data with graceful error tolerance
  let featuredProducts: any[] = [];
  let latestPhones: any[] = [];
  let latestAccessories: any[] = [];
  let brands: any[] = [];

  try {
    const [featuredRes, latestPhonesRes, accessoriesRes, brandsRes] = await Promise.allSettled([
      getFeaturedProducts(8),
      getPublishedProducts({ productType: 'phone', limit: 8, sort: 'newest', page: 1, availability: 'all' }),
      getPublishedProducts({ productType: 'accessory', limit: 4, sort: 'newest', page: 1, availability: 'all' }),
      getCatalogBrands(),
    ]);

    if (featuredRes.status === 'fulfilled') featuredProducts = featuredRes.value;
    if (latestPhonesRes.status === 'fulfilled') latestPhones = latestPhonesRes.value.products;
    if (accessoriesRes.status === 'fulfilled') latestAccessories = accessoriesRes.value.products;
    if (brandsRes.status === 'fulfilled') brands = brandsRes.value;
  } catch (_e) {
    // Graceful offline fallback
  }

  return (
    <div className="space-y-0 bg-[#000000]">
      {/* 1. Keynote Hero Section */}
      <HeroSection />

      {/* 2. Apple Difference Value Proposition */}
      <ValueProposition />

      {/* 3. Category Showcase */}
      <CategoryShowcase />

      {/* 4. Curated Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-[#000000]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                  المجموعة المختارة
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#f5f5f7] mt-1.5">
                  الموديلات الأكثر طلباً
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-1 text-sm text-[#0071e3] hover:underline font-normal transition-colors"
              >
                <span>عرض جميع الموديلات المميزة</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Latest Flagship Phones */}
      {latestPhones.length > 0 && (
        <section className="py-24 bg-[#000000] border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#0071e3]" />
                  أحدث الإصدارات
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#f5f5f7] mt-1.5">
                  أحدث الهواتف الذكية المعتمدة
                </h2>
              </div>
              <Link
                href="/products?productType=phone"
                className="inline-flex items-center gap-1 text-sm text-[#0071e3] hover:underline font-normal transition-colors"
              >
                <span>تصفح جميع الهواتف</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestPhones.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Apple Trade In Billboard */}
      <PromoBanner />

      {/* 7. Brands Directory */}
      <BrandShowcase brands={brands} />

      {/* 8. Original Accessories */}
      {latestAccessories.length > 0 && (
        <section className="py-24 bg-[#000000] border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-[#0071e3]" />
                  إكسسوارات معتمدة
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#f5f5f7] mt-1.5">
                  ملحقات وشواحن أصلية
                </h2>
              </div>
              <Link
                href="/products?productType=accessory"
                className="inline-flex items-center gap-1 text-sm text-[#0071e3] hover:underline font-normal transition-colors"
              >
                <span>عرض جميع الإكسسوارات</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestAccessories.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Specialist Consultation */}
      <WhatsAppSection />
    </div>
  );
}
