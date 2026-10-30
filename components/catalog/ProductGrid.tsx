import React from 'react';
import { PublicCatalogProduct } from '@/types/catalog';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: PublicCatalogProduct[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = 'لا توجد منتجات مطابقة في الكتالوج حاليًا.',
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 px-4 text-center rounded-3xl bg-white border border-[#d2d2d7] space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center text-neutral-500 mx-auto">
          <PackageOpen className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#1d1d1f]">{emptyMessage}</h3>
          <p className="text-xs text-[#6e6e73] max-w-md mx-auto">
            جرّب تغيير كلمات البحث، إزالة بعض الفلاتر، أو تصفح الأقسام الأخرى.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  );
}
