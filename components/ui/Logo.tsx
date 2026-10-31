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

function AppleLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function Logo({ className = '', showTagline = false }: LogoProps) {
  return (
    <Link href="/" aria-label="ملك التفاحه في مصر — الرئيسية" className={`king-logo ${className}`} dir="rtl">
      <span className="king-logo-type">
        <strong>
          <span className="king-logo-royal-word">
            <RoyalCrown />
            ملك التفاحه
          </span>
          <span>في مصر</span>
          <span className="king-apple-inline" aria-hidden="true">
            <AppleLogo className="king-apple-logo" />
          </span>
        </strong>
        {showTagline && <span dir="rtl">موبايلات وإكسسوارات أصلية</span>}
      </span>
    </Link>
  );
}
