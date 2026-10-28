'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, X } from 'lucide-react';

interface ProductSortProps {
  totalResults: number;
}

export function ProductSort({ totalResults }: ProductSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const activeFilters = [
    { key: 'search', label: `بحث: "${searchParams.get('search')}"` },
    { key: 'brand', label: `العلامة: ${searchParams.get('brand')}` },
    { key: 'productType', label: searchParams.get('productType') === 'phone' ? 'موبايلات' : 'إكسسوارات' },
    { key: 'condition', label: searchParams.get('condition') === 'new' ? 'جديد' : 'مستعمل' },
    { key: 'storage', label: `المساحة: ${searchParams.get('storage')}` },
    {
      key: 'availability',
      label:
        searchParams.get('availability') === 'in_stock'
          ? 'متوفر فقط'
          : searchParams.get('availability') === 'out_of_stock'
          ? 'نفد المخزون'
          : null,
    },
  ].filter((f) => searchParams.has(f.key) && f.label);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D0D] border border-neutral-800/80">
        {/* Results Counter */}
        <div className="text-xs text-neutral-400">
          عرض <strong className="text-white font-mono">{totalResults}</strong> منتج معتمد
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#D6AC63]" />
          <span className="text-xs text-neutral-400 font-medium">الترتيب:</span>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-[#D6AC63] transition-colors"
          >
            <option value="newest">الأحدث وصولاً</option>
            <option value="featured">المميز والموصى به</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-neutral-500 font-medium">فلاتر مطبقة:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-[#F1D49A] border border-[#D6AC63]/30"
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={() => removeFilter(f.key)}
                className="hover:text-white transition-colors"
                title="إزالة الفلتر"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
