import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className = '', showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Official Apple Silhouette Icon */}
      <div className="text-[#f5f5f7] group-hover:text-white transition-opacity duration-200">
        <svg
          viewBox="0 0 170 170"
          className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
          aria-hidden="true"
        >
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.6-7.85-11.7-14.34-6.3-9.98-11.2-21.2-14.7-33.68-3.5-12.47-5.25-24.3-5.25-35.48 0-14.9 3.52-27.18 10.57-36.85 7.05-9.67 16.14-14.6 27.27-14.8 4.7 0 10.15 1.25 16.34 3.75 6.2 2.5 10.22 3.82 12.07 3.96 1.7.13 6.02-1.37 12.98-4.5 6.95-3.13 12.87-4.57 17.75-4.33 13.5.7 24.3 5.48 32.4 14.34-11.77 7.1-17.55 16.9-17.33 29.38.22 9.8 4.1 17.9 11.63 24.3 7.53 6.4 16.32 10.1 26.37 11.1-.9 3.3-2 6.7-3.3 10.2zM119.22 31.85c0-7.3 2.6-14.2 7.8-20.7 5.2-6.5 11.7-10.7 19.5-11.15.1 1.2.1 2.3 0 3.3-.3 7.4-3.1 14.4-8.4 21-5.3 6.6-11.8 10.3-19.5 11.1-.1-1.2-.2-2.4 0-3.55z" />
        </svg>
      </div>

      {/* Official Apple Clean Typography Wordmark */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm sm:text-base font-semibold tracking-tight text-[#f5f5f7] group-hover:text-white transition-colors">
          APPLE KING
        </span>
        {showTagline && (
          <span className="text-[11px] text-[#86868b] border-r border-[#424245] pr-2 mr-2 hidden sm:inline">
            الوكيل المعتمد
          </span>
        )}
      </div>
    </Link>
  );
}
