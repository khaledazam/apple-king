import React from 'react';
import Link from 'next/link';
import { CatalogBrandItem } from '@/types/catalog';
import { ArrowLeft } from 'lucide-react';

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
    <section className="py-16 bg-[#080808] border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#D6AC63] uppercase tracking-widest font-mono">
              OFFICIAL BRANDS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              العلامات التجارية في الكتالوج
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs text-[#D6AC63] hover:text-[#F1D49A] flex items-center gap-1 font-semibold"
          >
            <span>كل العلامات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displayBrands.map((b) => (
            <Link
              key={b.name}
              href={`/products?brand=${encodeURIComponent(b.name)}`}
              className="p-6 rounded-2xl bg-[#121212] border border-neutral-800/80 hover:border-[#D6AC63]/50 transition-all text-center space-y-2 group"
            >
              <span className="text-xl font-black text-neutral-200 group-hover:text-[#F1D49A] font-mono transition-colors block">
                {b.name}
              </span>
              <span className="text-xs text-neutral-500 font-medium block">
                {b.productCount > 0 ? `${b.productCount} منتج متاح` : 'منتجات أصلية'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
