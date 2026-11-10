import React from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { ProductFilters } from '@/components/catalog/ProductFilters';
import { ProductSort } from '@/components/catalog/ProductSort';
import { CatalogMotionWrapper } from '@/components/catalog/CatalogMotionWrapper';
import { getPublishedProducts, getCatalogFilters } from '@/lib/catalog/queries';
import { parseAndValidateCatalogParams } from '@/lib/catalog/validation';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'كتالوج الهواتف والآيفون | ملك التفاحه — أحمد عبد العزيز (السنبلاوين)',
  description: 'تصفح أحدث أسعار وموديلات هواتف آيفون وسامسونج الأصلية وأجهزة كسر زيرو بضمان وإكسسوارات معتمدة في متجر ملك التفاحه (أحمد عبد العزيز) في السنبلاوين، محافظة الدقهلية.',
  keywords: [
    'كتالوج ملك التفاحه',
    'اسعار الايفون السنبلاوين',
    'ايفون السنبلاوين',
    'ملك التفاحه احمد عبد العزيز',
    'هواتف السنبلاوين',
    'سامسونج السنبلاوين',
    'ايفون مستعمل السنبلاوين',
  ],
};

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const validatedParams = parseAndValidateCatalogParams(resolvedParams);

  // Fetch catalog data and filter aggregations concurrently
  const [catalogResponse, filterOptions] = await Promise.all([
    getPublishedProducts(validatedParams),
    getCatalogFilters(),
  ]);

  const { products, pagination } = catalogResponse;

  // Build pagination URLs
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(resolvedParams)) {
      if (v && k !== 'page') {
        if (Array.isArray(v)) params.set(k, v[0]);
        else params.set(k, v);
      }
    }
    params.set('page', String(pageNumber));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Top Heading & Breadcrumb with Animation Classes */}
        <div className="catalog-heading catalog-animate-header space-y-3 border-b border-black/[0.08] pb-6">
          <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
            <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-[#1d1d1f] font-medium">كتالوج المنتجات</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                المتجر. كل ما تحبّه في مكان واحد.
              </h1>
              <p className="text-xs sm:text-sm text-[#6e6e73] max-w-2xl mt-1">
                استعرض التشكيلة الكاملة المتوفرة في فروع ملك التفاحه (أحمد عبد العزيز) مع التحديث اللحظي للأسعار والضمان.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e5e5ea] shadow-sm text-xs text-[#1d1d1f] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#d8b66b]" />
              <span>متاح حالياً: {pagination.total} منتج معتمد</span>
            </div>
          </div>
        </div>

        {/* Trade-In AI Promo Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1d1d1f] to-[#2d2d30] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-md border border-white/10" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d8b66b]/20 border border-[#d8b66b]/30 flex items-center justify-center text-[#f0d48a] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">معاك هاتف وعايز تبيعه كاش أو تبدله؟</span>
                <span className="px-2 py-0.5 rounded-full bg-[#d8b66b]/25 text-[#f0d48a] text-[10px] font-bold">جديد ⚡</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                استخدم أداة <strong>(تاخدوا جهازي بكام؟)</strong> لمعرفة السعر التقديري استناداً لأسعار دوبيزل والسوق المصري.
              </p>
            </div>
          </div>
          <Link
            href="/trade-in"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d0a753] to-[#f0d48a] hover:from-[#c59c47] hover:to-[#e2c478] text-[#221b0e] text-xs font-bold transition-all shadow-sm"
          >
            تاخدوا جهازي بكام؟ 🤖
          </Link>
        </div>

        {/* Main Catalog with Framer Motion & GSAP Orchestration */}
        <CatalogMotionWrapper totalProducts={pagination.total}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Right Sidebar: Dynamic Filters */}
            <div className="lg:col-span-1 catalog-filters-container">
              <ProductFilters filterOptions={filterOptions} />
            </div>

            {/* Left Main Content: Sort, Active Tags, Product Grid & Pagination */}
            <div className="lg:col-span-3 space-y-6">
              <ProductSort totalResults={pagination.total} />

              {/* Staggered Animated Product Grid */}
              <ProductGrid products={products} />

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-8 border-t border-[#d2d2d7]">
                  <div className="text-xs text-neutral-500 font-mono">
                    صفحة {pagination.page} من {pagination.totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    {pagination.hasPrevPage ? (
                      <Link
                        href={createPageUrl(pagination.page - 1)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-[#e8e8ed] border border-[#d2d2d7] text-xs text-[#1d1d1f] font-medium flex items-center gap-1 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>السابق</span>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-[#e8e8ed] border border-[#d2d2d7] text-xs text-neutral-600 font-medium flex items-center gap-1 cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>السابق</span>
                      </button>
                    )}

                    {pagination.hasNextPage ? (
                      <Link
                        href={createPageUrl(pagination.page + 1)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-[#e8e8ed] border border-[#d2d2d7] text-xs text-[#1d1d1f] font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>التالي</span>
                        <ChevronLeft className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-[#e8e8ed] border border-[#d2d2d7] text-xs text-neutral-600 font-medium flex items-center gap-1 cursor-not-allowed"
                      >
                        <span>التالي</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CatalogMotionWrapper>
      </div>
    </div>
  );
}
