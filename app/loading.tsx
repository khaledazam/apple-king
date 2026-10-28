import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      {/* Pulsing Gold Crown Silhouette */}
      <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-[#D6AC63]/40 flex items-center justify-center animate-pulse shadow-lg shadow-[#D6AC63]/10">
        <svg
          className="w-6 h-6 text-[#D6AC63]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      </div>

      <div className="space-y-1 text-center">
        <span className="text-xs font-mono font-bold text-[#F1D49A] tracking-widest uppercase">
          APPLE KING
        </span>
        <p className="text-xs text-neutral-500">جاري تحميل المنتجات والأسعار المعتمدة...</p>
      </div>
    </div>
  );
}
