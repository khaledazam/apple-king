'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, MessageCircle, Menu, X, Smartphone, Headphones, Tag, Sparkles } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبًا، أود الاستفسار عن الموبايلات المتوفرة في متجر APPLE KING.')}`;

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الموبايلات', href: '/products?productType=phone', icon: Smartphone },
    { label: 'الإكسسوارات', href: '/products?productType=accessory', icon: Headphones },
    { label: 'العروض والمميز', href: '/products?featured=true', icon: Sparkles },
    { label: 'جميع المنتجات', href: '/products' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Right Section: Brand Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center Section: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === '/products' && link.href.includes('?')
                  ? false
                  : pathname.startsWith(link.href.split('?')[0]);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#F1D49A] bg-white/5 font-semibold shadow-xs'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Left Section: Search Toggle & Direct WhatsApp CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900 transition-colors"
              title="بحث في الكتالوج"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Callout */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب المبيعات</span>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D6AC63]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Field */}
        {searchOpen && (
          <div className="py-3 pb-4 border-t border-neutral-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="ابحث عن هاتف، موديل، أو إكسسوار (مثل: iPhone 15 Pro Max، شاحن، 256GB)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full min-h-[48px] px-4 py-3 pl-11 rounded-2xl bg-neutral-900/90 border border-[#D6AC63]/40 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D6AC63]/50 focus:border-[#D6AC63] transition-all shadow-xl"
              />
              <button
                type="submit"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D6AC63] p-2"
                aria-label="تنفيذ البحث"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800/90 bg-[#0A0A0A]/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-200 hover:text-[#D6AC63] hover:bg-white/5 transition-colors"
              >
                {link.icon && <link.icon className="w-4 h-4 text-[#D6AC63]" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800/80">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40"
            >
              <MessageCircle className="w-5 h-5" />
              <span>استفسر وتواصل عبر واتساب</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
