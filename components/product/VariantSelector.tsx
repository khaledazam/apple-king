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
    <div className="space-y-4 pt-4 border-t border-neutral-800">
      {/* 1. Condition Selector */}
      {conditions.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-300">الحالة المعتمدة:</label>
          <div className="flex flex-wrap gap-2">
            {conditions.map((cond) => {
              const isSelected = currentVariant.condition === cond;
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => selectCondition(cond as string)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-md ring-2 ring-[#D6AC63]/50'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {cond === 'new' ? 'جديد أصلي بالكرتونة' : 'مستعمل بحالة ممتازة (كسر زيرو)'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Storage Selector */}
      {storages.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-300">السعة التخزينية:</label>
          <div className="flex flex-wrap gap-2">
            {storages.map((storage) => {
              const isSelected = currentVariant.storage === storage;
              return (
                <button
                  key={storage}
                  type="button"
                  onClick={() => selectStorage(storage as string)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-[#D6AC63] text-black shadow-md'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-[#D6AC63]/40'
                  }`}
                >
                  {storage}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-300">اللون:</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = currentVariant.color === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => selectColor(color as string)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-neutral-200 text-black font-bold ring-2 ring-[#D6AC63]'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
