import React from 'react';
import Link from 'next/link';
import { CatalogBrandItem } from '@/types/catalog';
import { ChevronLeft } from 'lucide-react';

interface BrandShowcaseProps {
  brands?: CatalogBrandItem[];
}

export function BrandShowcase({ brands = [] }: BrandShowcaseProps) {
  // Fallback popular flagship brands if API returns empty during initial setup
  const displayBrands =
    brands.length > 0
      ? brands
      : [
          { name: 'Apple', productCount: 12 },
          { name: 'Samsung', productCount: 8 },
          { name: 'Xiaomi', productCount: 5 },
          { name: 'Anker', productCount: 14 },
        ];

  return (
    <section className="py-20 bg-[#000000] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#86868b] uppercase tracking-wider font-mono">
              العلامات المعتمدة
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f5f5f7] mt-1">
              العلامات التجارية في الكتالوج
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-[#0071e3] hover:underline flex items-center gap-1 font-normal transition-colors"
          >
            <span>كل العلامات</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displayBrands.map((b) => (
            <Link
              key={b.name}
              href={`/products?brand=${encodeURIComponent(b.name)}`}
              className="p-6 rounded-[20px] bg-[#161617] border border-white/[0.08] hover:border-white/[0.2] transition-all text-center space-y-1.5 group"
            >
              <span className="text-xl font-semibold text-[#f5f5f7] group-hover:text-white transition-colors block">
                {b.name}
              </span>
              <span className="text-xs text-[#86868b] font-normal block">
                {b.productCount > 0 ? `${b.productCount} منتج متاح` : 'منتجات أصلية'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
