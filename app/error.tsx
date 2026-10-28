'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center bg-[#000000]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#161617] border border-white/[0.08] flex items-center justify-center text-amber-400 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#f5f5f7] tracking-tight">تعذر تحميل المحتوى</h1>
          <p className="text-xs text-[#86868b] leading-relaxed">
            حدث خطأ غير متوقع أثناء استرجاع بيانات الكتالوج. يمكنك إعادة المحاولة الآن أو الرجوع للصفحة الرئيسية.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d1d1f] hover:bg-[#2d2d2f] border border-white/[0.08] text-[#f5f5f7] font-medium text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>الصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
