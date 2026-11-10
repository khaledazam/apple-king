'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Smartphone, Layers, Flame, Headphones, ShieldCheck, Zap } from 'lucide-react';

interface CatalogMotionWrapperProps {
  children: ReactNode;
  totalProducts?: number;
}

const QUICK_CATEGORIES = [
  { label: 'جميع المنتجات', href: '/products', icon: Layers, activeMatch: (p: string, s: URLSearchParams) => !s.get('brand') && !s.get('productType') && !s.get('condition') },
  { label: 'أجهزة iPhone', href: '/products?brand=Apple&productType=phone', icon: Smartphone, activeMatch: (p: string, s: URLSearchParams) => s.get('brand') === 'Apple' },
  { label: 'أجهزة Samsung', href: '/products?brand=Samsung&productType=phone', icon: Zap, activeMatch: (p: string, s: URLSearchParams) => s.get('brand') === 'Samsung' },
  { label: 'أجهزة مستعملة (كسر زيرو)', href: '/products?condition=used', icon: ShieldCheck, activeMatch: (p: string, s: URLSearchParams) => s.get('condition') === 'used' },
  { label: 'إكسسوارات معتمدة', href: '/products?productType=accessory', icon: Headphones, activeMatch: (p: string, s: URLSearchParams) => s.get('productType') === 'accessory' },
];

export function CatalogMotionWrapper({ children, totalProducts }: CatalogMotionWrapperProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // GSAP Entrance Animations
  useEffect(() => {
    let disposed = false;
    let revert = () => {};

    async function initCatalogGsap() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      const root = rootRef.current;
      if (disposed || !root) return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      revert = () => media.revert();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // Heading subtle wave entrance
        gsap.fromTo(
          '.catalog-animate-header',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        // Quick categories entrance
        gsap.fromTo(
          '.catalog-quick-bar a',
          { opacity: 0, y: 15, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.5)' }
        );

        // Filters sidebar entrance
        gsap.fromTo(
          '.catalog-filters-container',
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' }
        );
      }, root);
    }

    initCatalogGsap();

    return () => {
      disposed = true;
      revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="catalog-motion-root">
      {/* ── Animated Quick Category Strip (Apple-Style Interactive Pills) ── */}
      <div className="catalog-quick-bar mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2.5 min-w-max">
          {QUICK_CATEGORIES.map((cat) => {
            const isActive = cat.activeMatch(pathname, searchParams);
            const Icon = cat.icon;

            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`relative px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#17140d] font-bold shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] bg-white border border-[#e5e5ea] hover:border-[#d8b66b]/50'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCatalogPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#e8c987] to-[#d8b66b] shadow-sm shadow-[#d8b66b]/30 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#17140d]' : 'text-[#86868b]'}`} />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}
