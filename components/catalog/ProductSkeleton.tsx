import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="rounded-3xl bg-[#111111] border border-neutral-800/90 p-5 space-y-4 animate-pulse">
      <div className="aspect-square w-full rounded-2xl bg-neutral-900" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-900 rounded w-1/3" />
        <div className="h-5 bg-neutral-900 rounded w-3/4" />
      </div>
      <div className="pt-3 border-t border-neutral-900 flex justify-between items-center">
        <div className="h-4 bg-neutral-900 rounded w-1/4" />
        <div className="h-6 bg-neutral-900 rounded w-1/3" />
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
