'use client';

import { InteractiveSurface } from '@/components/ui/MotionPrimitives';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  BatteryFull,
  Camera,
  Cpu,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  MapPin,
  Sparkles,
  Repeat,
} from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

const highlights = [
  { icon: Camera, title: 'كل لقطة، حكاية', detail: 'خلّي لحظاتك أقرب' },
  { icon: Cpu, title: 'جاهز ليومك', detail: 'للشغل، واللعب، وكل حاجة' },
  { icon: BatteryFull, title: 'كمّل على راحتك', detail: 'اختار اللي يناسب استخدامك' },
  { icon: Smartphone, title: 'التفاصيل بتفرق', detail: 'لونك. سعتك. اختيارك.' },
];

export function HeroSection() {
  const inquiryUrl = `https://wa.me/${sanitizeWhatsAppNumber()}?text=${encodeURIComponent(
    'أهلًا ملك التفاحه (أحمد عبد العزيز)، عايز استفسر عن أجهزة وموديلات iPhone 18 Pro Max المتاحة وكافة الأسعار والضمان.'
  )}`;

  return (
    <section className="king-hero" aria-labelledby="hero-title">
      {/* ── Luxury Ambient Glow Halo behind the device ── */}
      <div className="king-hero-ambient-glow" aria-hidden="true" />

      {/* ── Device Artwork with Subtle Floating Animation ── */}
      <div className="king-hero-art king-hero-float" aria-hidden="true">
        <Image
          src="/branding/iphone-18-burgundy-cinematic.png"
          alt="iPhone 18 Pro Max — ملك التفاحه أحمد عبد العزيز السنبلاوين"
          fill
          priority
          sizes="100vw"
          className="king-hero-image"
        />
      </div>

      <div className="king-hero-inner">
        <div className="king-hero-copy">
          {/* ── Trust & Authority Badges ── */}
          <div className="king-trust-pills" dir="rtl">
            <div className="king-trust-pill">
              <ShieldCheck size={14} className="text-[#dfbd76]" />
              <span>أجهزة أصلية معتمدة 100% بضمان حقيقي</span>
            </div>
            <div className="king-trust-pill">
              <MapPin size={14} className="text-[#dfbd76]" />
              <span>السنبلاوين · استلام فوري من الفرع</span>
            </div>
          </div>

          <p className="king-eyebrow" dir="ltr">
            <span /> THE PRO COLLECTION
          </p>

          <h1 id="hero-title" dir="ltr">
            iPhone 18<span>Pro Max</span>
          </h1>

          <div className="king-hero-arabic" dir="rtl">
            <h2>ملك التفاحه · أحمد عبد العزيز — اختيارك الأول بالسنبلاوين</h2>
            <p>
              تفاصيل تحبّها، وفخامة استثنائية في كل لمسة.
              <br />
              تشكيلة كاملة من الأجهزة الجديدة والكسر زيرو مع أعلى قيمة استبدال لجهازك القديم وضمان معتمد.
            </p>
          </div>

          <div className="king-hero-actions">
            <InteractiveSurface className="action-motion">
              <a
                href={inquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="king-button king-button-gold"
              >
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <ArrowRight size={18} />
                <span>نتكلم على واتساب</span>
                <MessageCircle size={21} />
              </a>
            </InteractiveSurface>

            <InteractiveSurface className="action-motion">
              <Link href="/products" className="king-button king-button-outline">
                <ArrowRight size={17} />
                <span>تصفح الاستور والأسعار</span>
              </Link>
            </InteractiveSurface>
          </div>

          {/* ── Fast Trust Metrics Bar ── */}
          <div className="king-stats-strip" dir="rtl">
            <div className="king-stat-item">
              <strong>معاينة وتجربة</strong>
              <span>افحص جهازك قبل الشراء</span>
            </div>
            <div className="king-stat-divider" />
            <div className="king-stat-item">
              <strong>فحص 30 نقطة</strong>
              <span>لكل جهاز كسر زيرو</span>
            </div>
            <div className="king-stat-divider" />
            <div className="king-stat-item">
              <strong>تبديل وترقية</strong>
              <span>بأعلى تقييم فوري</span>
            </div>
          </div>

          {/* ── Highlights Grid ── */}
          <div className="king-highlights" dir="ltr">
            {highlights.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="king-highlight" dir="rtl">
                <span className="king-highlight-icon">
                  <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a href="#collections" className="king-scroll">
        <span>شوف أكتر</span>
        <ArrowDown size={19} />
      </a>
      <span className="king-art-note">تصوّر سينمائي للجهاز · ملك التفاحه (السنبلاوين)</span>
    </section>
  );
}
