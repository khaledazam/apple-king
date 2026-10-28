import React from 'react';
import Link from 'next/link';
import { Smartphone, Headphones, ArrowLeft, Sparkles } from 'lucide-react';

export function CategoryShowcase() {
  const categories = [
    {
      title: 'موبايلات آبل آيفون',
      subtitle: 'Apple iPhone',
      count: 'أحدث الإصدارات Pro & Pro Max',
      href: '/products?brand=Apple&productType=phone',
      gradient: 'from-amber-900/30 via-neutral-900 to-[#121212]',
      border: 'hover:border-[#D6AC63]/50',
      icon: Smartphone,
    },
    {
      title: 'موبايلات سامسونج',
      subtitle: 'Samsung Galaxy',
      count: 'سلسلة S24 وسلسلة Z القابلة للطي',
      href: '/products?brand=Samsung&productType=phone',
      gradient: 'from-blue-950/30 via-neutral-900 to-[#121212]',
      border: 'hover:border-blue-500/40',
      icon: Smartphone,
    },
    {
      title: 'هواتف ذكية متنوعة',
      subtitle: 'Smartphones & Flagships',
      count: 'شاومي، أوبو، وهواتف أندرويد رائدة',
      href: '/products?productType=phone',
      gradient: 'from-purple-950/30 via-neutral-900 to-[#121212]',
      border: 'hover:border-purple-500/40',
      icon: Sparkles,
    },
    {
      title: 'إكسسوارات وشواحن أصلية',
      subtitle: 'Original Accessories',
      count: 'شواحن سريعة، سماعات، وكابلات معتمدة',
      href: '/products?productType=accessory',
      gradient: 'from-emerald-950/30 via-neutral-900 to-[#121212]',
      border: 'hover:border-emerald-500/40',
      icon: Headphones,
    },
  ];

  return (
    <section className="py-20 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#D6AC63] uppercase tracking-widest font-mono">
              DISCOVER BY CATEGORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              تصفح الكتالوج حسب القسم
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#D6AC63] hover:text-[#F1D49A] font-semibold transition-colors"
          >
            <span>عرض كل الأقسام والمنتجات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                href={cat.href}
                className={`group relative p-6 rounded-3xl bg-gradient-to-br ${cat.gradient} border border-neutral-800/80 ${cat.border} transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[220px] shadow-lg overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#D6AC63]" />
                  </div>
                  <span className="text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
                    {cat.subtitle}
                  </span>
                </div>

                <div className="space-y-1.5 pt-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#F1D49A] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-neutral-400">{cat.count}</p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-[#D6AC63] group-hover:translate-x-[-4px] transition-transform">
                  <span>تصفح الأجهزة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
