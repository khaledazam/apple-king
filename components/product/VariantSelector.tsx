'use client';

import React from 'react';
import { PublicVariant } from '@/types/catalog';

interface VariantSelectorProps {
  variants: PublicVariant[];
  selectedVariantKey: string;
  onSelectVariant: (variantKey: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantKey,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Extract distinct attributes
  const storages = Array.from(new Set(variants.map((v) => v.storage).filter(Boolean)));
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  const conditions = Array.from(new Set(variants.map((v) => v.condition).filter(Boolean)));

  const currentVariant = variants.find((v) => v.variantKey === selectedVariantKey) || variants[0];

  // Helper to map color to Apple finish hex
  const getColorHex = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('أسود') || n.includes('black')) return '#2b2c2e';
    if (n.includes('تيتانيوم') || n.includes('natural')) return '#9a958e';
    if (n.includes('أبيض') || n.includes('white')) return '#e3e4e6';
    if (n.includes('صحراوي') || n.includes('desert') || n.includes('ذهبي') || n.includes('gold')) return '#cbb7a2';
    if (n.includes('أزرق') || n.includes('blue')) return '#39424c';
    if (n.includes('بنفسجي') || n.includes('purple')) return '#645d73';
    if (n.includes('أخضر') || n.includes('green')) return '#404c40';
    if (n.includes('وردي') || n.includes('pink')) return '#e8c4c4';
    if (n.includes('أحمر') || n.includes('red')) return '#b83b3b';
    return '#86868b';
  };

  // Smart attribute-preserving variant finder
  const selectColor = (color: string) => {
    const matching =
      variants.find(
        (v) =>
          v.color === color &&
          (!currentVariant.storage || v.storage === currentVariant.storage) &&
          (!currentVariant.condition || v.condition === currentVariant.condition)
      ) ||
      variants.find(
        (v) => v.color === color && (!currentVariant.storage || v.storage === currentVariant.storage)
      ) ||
      variants.find((v) => v.color === color);

    if (matching) {
      onSelectVariant(matching.variantKey);
    }
  };

  const selectStorage = (storage: string) => {
    const matching =
      variants.find(
        (v) =>
          v.storage === storage &&
          (!currentVariant.color || v.color === currentVariant.color) &&
          (!currentVariant.condition || v.condition === currentVariant.condition)
      ) ||
      variants.find(
        (v) => v.storage === storage && (!currentVariant.color || v.color === currentVariant.color)
      ) ||
      variants.find((v) => v.storage === storage);

    if (matching) {
      onSelectVariant(matching.variantKey);
    }
  };

  const selectCondition = (cond: string) => {
    const matching =
      variants.find(
        (v) =>
          v.condition === cond &&
          (!currentVariant.storage || v.storage === currentVariant.storage) &&
          (!currentVariant.color || v.color === currentVariant.color)
      ) ||
      variants.find(
        (v) => v.condition === cond && (!currentVariant.storage || v.storage === currentVariant.storage)
      ) ||
      variants.find((v) => v.condition === cond);

    if (matching) {
      onSelectVariant(matching.variantKey);
    }
  };

  return (
    <div className="space-y-8 pt-6 border-t border-black/[0.08]">
      {/* 1. Official Apple Finish / Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              اللون. <span className="font-normal text-[#6e6e73]">اختر المفضل لديك.</span>
            </h3>
            {currentVariant.color && (
              <span className="text-xs font-medium text-[#1d1d1f]">{currentVariant.color}</span>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {colors.map((color) => {
              const isSelected = currentVariant.color === color;
              const hex = getColorHex(color as string);

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => selectColor(color as string)}
                  className={`p-1 rounded-full transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-[#0071e3] ring-offset-2 ring-offset-[#000000]'
                      : 'hover:opacity-80'
                  }`}
                  title={color as string}
                  aria-label={color as string}
                >
                  <span
                    className="block w-8 h-8 rounded-full border border-black/30 shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Official Apple Storage / Capacity Selector (Segmented Boxes) */}
      {storages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">
            المساحة. <span className="font-normal text-[#6e6e73]">ما السعة التي تناسبك؟</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {storages.map((storage) => {
              const isSelected = currentVariant.storage === storage;
              // Find price for this storage in selected color
              const vForStorage = variants.find(
                (v) => v.storage === storage && (!currentVariant.color || v.color === currentVariant.color)
              ) || variants.find((v) => v.storage === storage);

              return (
                <button
                  key={storage}
                  type="button"
                  onClick={() => selectStorage(storage as string)}
                  className={`p-4 rounded-2xl text-center transition-all duration-200 border ${
                    isSelected
                      ? 'border-2 border-[#0071e3] bg-[#0071e3]/[0.06]'
                      : 'border-[#424245] bg-white hover:border-[#86868b]'
                  }`}
                >
                  <span className="block text-lg font-semibold text-[#1d1d1f] tracking-tight">
                    {storage}
                  </span>
                  {vForStorage && (
                    <span className="block text-xs text-[#6e6e73] mt-1">
                      {new Intl.NumberFormat('en-US').format(vForStorage.price)} ج.م
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Official Apple Condition Selector */}
      {conditions.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">
            حالة الجهاز. <span className="font-normal text-[#6e6e73]">اختر الحالة المعتمدة.</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conditions.map((cond) => {
              const isSelected = currentVariant.condition === cond;
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => selectCondition(cond as string)}
                  className={`p-4 rounded-2xl text-right transition-all duration-200 border ${
                    isSelected
                      ? 'border-2 border-[#0071e3] bg-[#0071e3]/[0.06]'
                      : 'border-[#424245] bg-white hover:border-[#86868b]'
                  }`}
                >
                  <span className="block text-sm font-semibold text-[#1d1d1f]">
                    {cond === 'new' ? 'جديد أصلي بالكرتونة' : 'مستعمل معتمد (كسر زيرو)'}
                  </span>
                  <span className="block text-xs text-[#6e6e73] mt-1">
                    {cond === 'new' ? 'ضمان رسمي كامل معتمد' : 'مفحوص بدقة مع تقرير كفاءة البطارية'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
