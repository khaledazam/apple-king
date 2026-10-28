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
import { ArrowLeft, Sparkles, Smartphone, Headphones } from 'lucide-react';

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
    <div className="space-y-0">
      {/* 7.1 Cinematic iPhone 18 Pro Max Hero */}
      <HeroSection />

      {/* 7.2 Brand Value Proposition */}
      <ValueProposition />

      {/* 7.3 Shop by Category */}
      <CategoryShowcase />

      {/* 7.4 Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#D6AC63] uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  CURATED SELECTION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  المنتجات المميزة والموصى بها
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-1.5 text-xs text-[#D6AC63] hover:text-[#F1D49A] font-semibold transition-colors"
              >
                <span>عرض جميع المنتجات المميزة</span>
                <ArrowLeft className="w-4 h-4" />
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

      {/* 7.5 Latest Flagship Phones */}
      {latestPhones.length > 0 && (
        <section className="py-20 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#D6AC63] uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  LATEST ARRIVALS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  أحدث الهواتف الذكية المعتمدة
                </h2>
              </div>
              <Link
                href="/products?productType=phone"
                className="inline-flex items-center gap-1.5 text-xs text-[#D6AC63] hover:text-[#F1D49A] font-semibold transition-colors"
              >
                <span>تصفح جميع الهواتف</span>
                <ArrowLeft className="w-4 h-4" />
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

      {/* 7.6 Premium Promotional Banner */}
      <PromoBanner />

      {/* 7.7 Popular Brands Showcase */}
      <BrandShowcase brands={brands} />

      {/* 7.8 Accessories Showcase */}
      {latestAccessories.length > 0 && (
        <section className="py-20 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  ORIGINAL ACCESSORIES
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  الإكسسوارات والشواحن الأصلية
                </h2>
              </div>
              <Link
                href="/products?productType=accessory"
                className="inline-flex items-center gap-1.5 text-xs text-[#D6AC63] hover:text-[#F1D49A] font-semibold transition-colors"
              >
                <span>عرض جميع الإكسسوارات</span>
                <ArrowLeft className="w-4 h-4" />
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

      {/* 7.9 WhatsApp Direct Consultation */}
      <WhatsAppSection />
    </div>
  );
}
