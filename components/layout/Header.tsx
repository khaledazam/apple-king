'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, MessageCircle, Menu, X, ChevronLeft } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const whatsappNumber = sanitizeWhatsAppNumber();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحبًا، أود الاستفسار عن الأجهزة والإكسسوارات المتاحة في متجر APPLE KING.'
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
      <header className="sticky top-0 z-[100] apple-nav transition-all duration-200">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation Links (Apple Style Micro-Typography) */}
            <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href.split('?')[0]);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-normal transition-colors duration-200 ${
                      isActive
                        ? 'text-[#f5f5f7] font-medium'
                        : 'text-[#86868b] hover:text-[#f5f5f7]'
                    }`}
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
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-[#86868b] hover:text-[#f5f5f7] transition-colors"
                aria-label="بحث في الكتالوج"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Direct WhatsApp Sales Link (Apple Store Pill) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب المبيعات</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full lg:hidden text-[#86868b] hover:text-[#f5f5f7] transition-colors"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Apple Expandable Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-white/[0.08] bg-[#000000]/95 backdrop-blur-xl px-4 py-4 animate-fadeIn">
            <div className="max-w-[680px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن هاتف، شاحن، كابل، أو إكسسوار..."
                  className="w-full h-11 pr-11 pl-4 rounded-xl bg-[#1d1d1f] border border-[#424245] text-sm text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition-colors"
                  autoFocus
                />
                <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-[#86868b]" />
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer (Apple Style) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] bg-[#000000] px-6 py-6 space-y-4">
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-base font-medium text-[#f5f5f7] border-b border-white/[0.06]"
                >
                  <span>{link.label}</span>
                  <ChevronLeft className="w-4 h-4 text-[#86868b]" />
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
          </div>
        )}
      </header>

      {/* Official Apple Store Announcement Ribbon */}
      <div className="apple-ribbon py-2.5 px-4 text-center text-xs text-[#86868b]">
        <div className="max-w-[1024px] mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span>أحدث أجهزة iPhone وموبايلات سامسونج وإكسسوارات أبل متوفرة للتسليم الفوري من فروعنا.</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2997ff] hover:underline font-medium inline-flex items-center gap-0.5"
          >
            <span>استفسر الآن</span>
            <ChevronLeft className="w-3 h-3 inline-block" />
          </a>
        </div>
      </div>
    </>
  );
}
