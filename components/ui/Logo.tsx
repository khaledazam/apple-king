import Link from 'next/link';
import { useId } from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

function RoyalCrown() {
  const id = useId();
  return (
    <svg className="royal-word-crown" viewBox="0 0 96 62" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-gold`} x1="10" y1="8" x2="82" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8e6125" /><stop offset=".19" stopColor="#f7dc91" /><stop offset=".35" stopColor="#fff0bd" /><stop offset=".51" stopColor="#c9973e" /><stop offset=".72" stopColor="#edca70" /><stop offset="1" stopColor="#936122" />
        </linearGradient>
        <linearGradient id={`${id}-band`} x1="48" y1="40" x2="48" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff0ba" /><stop offset=".22" stopColor="#d7ae57" /><stop offset=".57" stopColor="#986426" /><stop offset=".82" stopColor="#e6c679" /><stop offset="1" stopColor="#b88838" />
        </linearGradient>
        <linearGradient id={`${id}-ruby`} x1="45" y1="43" x2="51" y2="51" gradientUnits="userSpaceOnUse"><stop stopColor="#df8d84" /><stop offset=".45" stopColor="#8e3445" /><stop offset="1" stopColor="#401a2c" /></linearGradient>
      </defs>
      <path d="M15 43 8 18l19 12 6-18 9 15L48 5l6 22 9-15 6 18 19-12-7 25Z" fill={`url(#${id}-gold)`} stroke="#e7c47c" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="m13 22 7 17h57l7-17M33 16l-4 18m19-24v24m15-18 4 18" stroke="#fff2c3" strokeOpacity=".65" strokeWidth="1.1" strokeLinecap="round" />
      <path d="m17 42 62 0-1 11c-19 5-41 5-60 0Z" fill={`url(#${id}-band)`} stroke="#b98a3e" strokeWidth="1.1" />
      <path d="M19 44h58M20 52c18 4 38 4 56 0" stroke="#ffe5a1" strokeWidth="1" strokeLinecap="round" />
      {[{ x: 8, y: 17 }, { x: 33, y: 11 }, { x: 48, y: 5 }, { x: 63, y: 11 }, { x: 88, y: 17 }].map(({ x, y }) => <circle key={x} cx={x} cy={y} r={x === 48 ? 3.5 : 2.7} fill={`url(#${id}-gold)`} stroke="#ffedb4" strokeWidth=".7" />)}
      <path d="m48 43 4 4-4 4-4-4Z" fill={`url(#${id}-ruby)`} stroke="#ffe5a1" strokeWidth=".8" />
      <circle cx="28" cy="47" r="1.6" fill="#fff0bd" /><circle cx="68" cy="47" r="1.6" fill="#fff0bd" />
    </svg>
  );
}

export function Logo({ className = '', showTagline = false }: LogoProps) {
  return (
    <Link href="/" aria-label="ملك التفاحه — الرئيسية" className={`king-logo ${className}`} dir="rtl">
      <span className="king-logo-type">
        <strong><span className="king-logo-royal-word"><RoyalCrown />ملك</span>{' '}التفاحه</strong>
        {showTagline && <span dir="rtl">موبايلات وإكسسوارات أصلية</span>}
      </span>
    </Link>
  );
}
