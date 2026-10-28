import React from 'react';
import Link from 'next/link';
import { Smartphone, Headphones, ChevronLeft, Sparkles, Watch } from 'lucide-react';

export function CategoryShowcase() {
  const categories = [
    {
      title: 'iPhone',
      arabicTitle: 'هواتف آبل آيفون',
      count: 'سلسلة iPhone 16 Pro وPro Max',
      href: '/products?brand=Apple&productType=phone',
      icon: Smartphone,
    },
    {
      title: 'Galaxy',
      arabicTitle: 'هواتف سامسونج جالاكسي',
      count: 'سلسلة S24 Ultra والأجهزة القابلة للطي',
      href: '/products?brand=Samsung&productType=phone',
      icon: Smartphone,
    },
    {
      title: 'Accessories',
      arabicTitle: 'إكسسوارات وشواحن أصلية',
      count: 'شواحن MagSafe وكابلات وسماعات معتمدة',
      href: '/products?productType=accessory',
      icon: Headphones,
    },
    {
      title: 'Certified Devices',
      arabicTitle: 'أجهزة مستعملة معتمدة',
      count: 'كسر زيرو بفحص شامل وضمان معتمد',
      href: '/products?condition=used',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-24 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-[#86868b] uppercase tracking-wider font-mono">
              تصفح الكتالوج
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#f5f5f7] mt-1.5">
              استكشف حسب الفئة
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm text-[#0071e3] hover:underline transition-colors font-normal"
          >
            <span>عرض جميع المنتجات</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid - Apple Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                href={cat.href}
                className="group relative p-7 rounded-[24px] bg-[#161617] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#1d1d1f] border border-white/[0.06] flex items-center justify-center text-[#f5f5f7] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-[#f5f5f7]" />
                  </div>
                  <span className="text-xs font-mono text-[#86868b] tracking-wider">
                    {cat.title}
                  </span>
                </div>

                <div className="space-y-1 pt-6">
                  <h3 className="text-lg font-semibold text-[#f5f5f7] group-hover:text-white transition-colors">
                    {cat.arabicTitle}
                  </h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">{cat.count}</p>
                </div>

                <div className="pt-4 flex items-center gap-1 text-xs font-normal text-[#0071e3] group-hover:translate-x-[-3px] transition-transform">
                  <span>استكشف الموديلات</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
