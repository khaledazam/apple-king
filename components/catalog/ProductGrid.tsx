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
      <div className="py-20 px-4 text-center rounded-3xl bg-[#0D0D0D] border border-neutral-800/80 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
          <PackageOpen className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-neutral-200">{emptyMessage}</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
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
