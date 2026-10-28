import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className = '', showTagline = true }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Luxury Gold Crown Icon */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/10 transition-transform duration-300 group-hover:scale-105">
        <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#D6AC63] transition-colors group-hover:text-[#F1D49A]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col text-right">
        <span className="text-lg font-black tracking-wider text-white font-mono group-hover:text-[#F1D49A] transition-colors leading-none">
          APPLE <span className="text-[#D6AC63]">KING</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-semibold text-neutral-400 tracking-wider mt-1">
            موبايلات وإكسسوارات أصلية
          </span>
        )}
      </div>
    </Link>
  );
}
