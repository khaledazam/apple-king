import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="rounded-3xl bg-white border border-[#d2d2d7]/90 p-5 space-y-4 animate-pulse">
      <div className="aspect-square w-full rounded-2xl bg-[#e8e8ed]" />
      <div className="space-y-2">
        <div className="h-4 bg-[#e8e8ed] rounded w-1/3" />
        <div className="h-5 bg-[#e8e8ed] rounded w-3/4" />
      </div>
      <div className="pt-3 border-t border-[#e8e8ed] flex justify-between items-center">
        <div className="h-4 bg-[#e8e8ed] rounded w-1/4" />
        <div className="h-6 bg-[#e8e8ed] rounded w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
