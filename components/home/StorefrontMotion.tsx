'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** The content stays readable before JavaScript and when motion is disabled. */
export function StorefrontMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let revert = () => {};

    async function initializeMotion() {
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
        const hero = root.querySelector('.king-hero');
        // Do not replay the opening when returning to a scrolled position.
        if (hero && window.scrollY < 80) {
          const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
          timeline.fromTo('.king-eyebrow', { opacity: 0.3, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
            .fromTo('.king-hero h1', { opacity: 0.3, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.35')
            .fromTo('.king-hero h1 > span', { x: 18 }, { x: 0, duration: 0.8 }, '-=0.75')
            .fromTo('.king-hero-art', { opacity: 0.45 }, { opacity: 1, duration: 1.4 }, 0)
            .fromTo('.king-hero-arabic, .king-hero-actions', { opacity: 0.3, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
            .fromTo('.king-highlight', { opacity: 0.35, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, '-=0.3');
        }

        root.querySelectorAll('.trade-visual').forEach(visual => {
          gsap.fromTo(visual.querySelector('.trade-phone-new'), { y: 28, rotation: 4 }, {
            y: 0, rotation: 12, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: visual, start: 'top 88%', once: true },
          });
        });

        const groups = [
          ['.shop-shortcuts', 'a'],
          ['.department-grid', '.department-card'],
          ['.department-bottom', '.department-mini'],
          ['.shop-product-grid', '.shop-product-card'],
          ['.guide-grid', 'article'],
          ['.service-grid', 'article'],
        ];
        groups.forEach(([containerSelector, itemSelector]) => {
          root.querySelectorAll(containerSelector).forEach(container => {
            const items = container.querySelectorAll(itemSelector);
            gsap.fromTo(items, { opacity: 0.35, y: 24 }, {
              opacity: 1, y: 0, duration: 0.7, stagger: 0.075, ease: 'power2.out', clearProps: 'transform,opacity',
              scrollTrigger: { trigger: container, start: 'top 90%', once: true },
            });
          });
        });

        root.querySelectorAll('.shop-heading, .trade-panel, .specialist-inner, .faq-section > div:first-child').forEach(element => {
          gsap.fromTo(element, { opacity: 0.4, y: 22 }, {
            opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
          });
        });
      }, root);

      // A small desktop-only drift keeps the device clear on smaller screens.
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.king-hero-image', {
          yPercent: 2, ease: 'none',
          scrollTrigger: { trigger: '.king-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
      }, root);
    }

    // A failed optional animation download must never interrupt shopping.
    initializeMotion().catch(() => revert());
    return () => { disposed = true; revert(); };
  }, []);

  return <div ref={rootRef} className="king-storefront">{children}</div>;
}
