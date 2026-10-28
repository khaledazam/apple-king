'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';
import { CatalogFilterOptions } from '@/types/catalog';

interface ProductFiltersProps {
  filterOptions?: CatalogFilterOptions;
}

export function ProductFilters({ filterOptions }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active filter values from URL
  const activeBrand = searchParams.get('brand') || '';
  const activeType = searchParams.get('productType') || '';
  const activeCondition = searchParams.get('condition') || '';
  const activeStorage = searchParams.get('storage') || '';
  const activeAvailability = searchParams.get('availability') || 'all';
  const currentSearch = searchParams.get('search') || '';

  // Helper to update a URL parameter while preserving other filters
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`/products?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push('/products');
  };

  const hasActiveFilters = Boolean(
    activeBrand ||
    activeType ||
    activeCondition ||
    activeStorage ||
    activeAvailability !== 'all' ||
    currentSearch
  );

  return (
    <aside className="p-6 rounded-[24px] bg-[#161617] border border-white/[0.08] space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0071e3]" />
          <h3 className="text-sm font-semibold text-[#f5f5f7]">تصفية النتائج</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-[11px] text-[#86868b] hover:text-[#0071e3] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة ضبط</span>
          </button>
        )}
      </div>

      {/* 1. Availability Status */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-[#86868b]">حالة التوافر</label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'الكل', value: 'all' },
            { label: 'متوفر فقط', value: 'in_stock' },
            { label: 'نفد المخزون', value: 'out_of_stock' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => updateFilter('availability', item.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeAvailability === item.value
                  ? 'bg-[#0071e3] text-white shadow-sm'
                  : 'bg-[#1d1d1f] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Product Type */}
      <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
        <label className="text-xs font-semibold text-[#86868b]">نوع المنتج</label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'الكل', value: '' },
            { label: 'موبايلات', value: 'phone' },
            { label: 'إكسسوارات', value: 'accessory' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => updateFilter('productType', item.value || null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeType === item.value
                  ? 'bg-[#0071e3] text-white shadow-sm'
                  : 'bg-[#1d1d1f] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Brands List */}
      {filterOptions?.brands && filterOptions.brands.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
          <label className="text-xs font-semibold text-[#86868b]">العلامة التجارية</label>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto no-scrollbar">
            <button
              type="button"
              onClick={() => updateFilter('brand', null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !activeBrand
                  ? 'bg-[#0071e3] text-white'
                  : 'bg-[#1d1d1f] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06]'
              }`}
            >
              الكل
            </button>
            {filterOptions.brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => updateFilter('brand', b)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeBrand === b
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-[#1d1d1f] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Condition Filter */}
      <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
        <label className="text-xs font-semibold text-[#86868b]">حالة الجهاز</label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'الكل', value: '' },
            { label: 'جديد أصلي', value: 'new' },
            { label: 'مستعمل معتمد', value: 'used' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => updateFilter('condition', item.value || null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCondition === item.value
                  ? 'bg-[#0071e3] text-white'
                  : 'bg-[#1d1d1f] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Storage Options */}
      {filterOptions?.storageOptions && filterOptions.storageOptions.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
          <label className="text-xs font-semibold text-[#86868b]">المساحة التخزينية</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => updateFilter('storage', null)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                !activeStorage
                  ? 'bg-[#0071e3] text-white'
                  : 'bg-[#1d1d1f] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06]'
              }`}
            >
              الكل
            </button>
            {filterOptions.storageOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateFilter('storage', s)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                  activeStorage === s
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-[#1d1d1f] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
