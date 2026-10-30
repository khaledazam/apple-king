'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, MessageCircle, Menu, X, ChevronLeft } from 'lucide-react';
import { AnimatedPanel } from '../ui/MotionPrimitives';
import { Logo } from '../ui/Logo';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const isHome = usePathname() === '/';

  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود الاستفسار عن الأجهزة والإكسسوارات المتاحة في متجر ملك التفاحه.'
  )}`;

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'iPhone', href: '/products?brand=Apple&productType=phone' },
    { label: 'Samsung', href: '/products?brand=Samsung&productType=phone' },
    { label: 'الإكسسوارات', href: '/products?productType=accessory' },
    { label: 'الأجهزة المستعملة', href: '/products?condition=used' },
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
    <>
      {/* Official Apple Global Navigation Bar */}
      <header onKeyDown={(event) => { if (event.key === 'Escape') { setSearchOpen(false); setMobileMenuOpen(false); } }} className={`sticky top-0 z-[100] apple-nav transition-all duration-200 ${isHome ? 'king-nav' : ''}`}>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10">
          <div className="king-nav-inner flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <Logo showTagline={isHome} />
            </div>

            {/* Desktop Navigation Links (Apple Style Micro-Typography) */}
            <nav className="hidden xl:flex items-center gap-6 xl:gap-8" aria-label="القائمة الرئيسية">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`king-nav-link text-xs font-normal text-[#424245] hover:text-black transition-colors duration-200 ${isHome && link.href === '/' ? 'is-current' : ''}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons: Search & WhatsApp Inquiries */}
            <div className="flex items-center gap-3">
              {/* Apple Minimalist Search Trigger */}
              <button
                type="button"
                onClick={() => { setSearchOpen(!searchOpen); setMobileMenuOpen(false); }}
                aria-expanded={searchOpen} aria-controls="catalog-search" className="min-w-11 min-h-11 flex items-center justify-center text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                aria-label="بحث في الكتالوج"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Direct WhatsApp Sales Link (Apple Store Pill) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="king-nav-contact hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب المبيعات</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setSearchOpen(false); }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full xl:hidden text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                aria-label="القائمة" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Apple Expandable Search Dropdown */}
        <AnimatedPanel open={searchOpen} id="catalog-search" className="border-t border-black/[0.08] bg-white/95 backdrop-blur-xl px-4 py-4 ">
            <div className="max-w-[680px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="search"
                  aria-label="ابحث في المنتجات"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن هاتف، شاحن، كابل، أو إكسسوار..."
                  className="w-full h-11 pr-11 pl-4 rounded-xl bg-[#f5f5f7] border border-[#424245] text-sm text-[#1d1d1f] placeholder-[#6e6e73] focus:outline-none focus:border-[#0071e3] transition-colors"
                  autoFocus
                />
                <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-[#6e6e73]" />
              </form>
            </div>
        </AnimatedPanel>

        {/* Mobile Navigation Drawer (Apple Style) */}
        <AnimatedPanel open={mobileMenuOpen} id="mobile-navigation" className="xl:hidden border-t border-black/[0.08] bg-[#f5f5f7] px-6 py-6 space-y-4">
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-base font-medium text-[#1d1d1f] border-b border-black/[0.06]"
                >
                  <span>{link.label}</span>
                  <ChevronLeft className="w-4 h-4 text-[#6e6e73]" />
                </Link>
              ))}
            </nav>

            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>استفسر وتواصل عبر واتساب</span>
              </a>
            </div>
        </AnimatedPanel>
      </header>

      {/* Official Apple Store Announcement Ribbon */}
      <div className={`${isHome ? 'hidden' : ''} apple-ribbon py-2.5 px-4 text-center text-xs text-[#6e6e73]`}>
        <div className="max-w-[1024px] mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span>أحدث أجهزة iPhone وموبايلات سامسونج وإكسسوارات أبل متوفرة للتسليم الفوري من فروعنا.</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066cc] hover:underline font-medium inline-flex items-center gap-0.5"
          >
            <span>استفسر الآن</span>
            <ChevronLeft className="w-3 h-3 inline-block" />
          </a>
        </div>
      </div>
    </>
  );
}
