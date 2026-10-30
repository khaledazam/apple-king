'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ACCESSORY_DEPARTMENTS } from '@/lib/catalog/categories';
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
    if (key === 'productType') params.delete('category');
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const activeFilters = [
    { key: 'search', label: `بحث: "${searchParams.get('search')}"` },
    { key: 'category', label: ACCESSORY_DEPARTMENTS.find(item => item.value === searchParams.get('category'))?.label || searchParams.get('category') },
    { key: 'brand', label: `العلامة: ${searchParams.get('brand')}` },
    { key: 'productType', label: searchParams.get('productType') === 'phone' ? 'موبايلات' : 'إكسسوارات' },
    { key: 'condition', label: searchParams.get('condition') === 'new' ? 'جديد أصلي' : 'مستعمل معتمد' },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[20px] bg-white border border-black/[0.08]">
        {/* Results Counter */}
        <div className="text-xs text-[#6e6e73]">
          عرض <strong className="text-[#1d1d1f] font-medium">{totalResults}</strong> منتج معتمد
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#6e6e73]" />
          <span className="text-xs text-[#6e6e73] font-normal">الترتيب:</span>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3.5 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors cursor-pointer"
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
          <span className="text-xs text-[#6e6e73] font-normal">الفلاتر المطبقة:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-white text-[#1d1d1f] border border-black/[0.1]"
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={() => removeFilter(f.key)}
                className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
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
