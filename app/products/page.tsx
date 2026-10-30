import React from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { ProductFilters } from '@/components/catalog/ProductFilters';
import { ProductSort } from '@/components/catalog/ProductSort';
import { getPublishedProducts, getCatalogFilters } from '@/lib/catalog/queries';
import { parseAndValidateCatalogParams } from '@/lib/catalog/validation';
import { ChevronRight, ChevronLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'كتالوج المنتجات | ملك التفاحه',
  description: 'تصفح أحدث الهواتف الذكية والإكسسوارات الأصلية المعتمدة في مصر بأسعار منافسة وتسليم فوري من فروع ملك التفاحه.',
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
        {/* Page Top Heading & Breadcrumb */}
        <div className="catalog-heading space-y-2 border-b border-black/[0.08] pb-6">
          <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
            <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-[#1d1d1f] font-medium">كتالوج المنتجات</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
            المتجر. كل ما تحبّه في مكان واحد.
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] max-w-2xl">
            استعرض التشكيلة الكاملة المتوفرة في فروعنا مع إمكانية الفلترة الدقيقة حسب السعر، العلامة التجارية،
            والمساحة التخزينية.
          </p>
        </div>

        {/* Main Catalog Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Right Sidebar: Dynamic Filters */}
          <div className="lg:col-span-1">
            <ProductFilters filterOptions={filterOptions} />
          </div>

          {/* Left Main Content: Sort, Active Tags, Product Grid & Pagination */}
          <div className="lg:col-span-3 space-y-6">
            <ProductSort totalResults={pagination.total} />

            {/* Product Grid */}
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
      </div>
    </div>
  );
}
