import { InteractiveSurface } from '@/components/ui/MotionPrimitives';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight, BatteryFull, Camera, Cpu, MessageCircle, Smartphone } from 'lucide-react';
import { sanitizeWhatsAppNumber } from '@/lib/whatsapp';

const highlights = [
  { icon: Camera, title: 'كل لقطة، حكاية', detail: 'خلّي لحظاتك أقرب' },
  { icon: Cpu, title: 'جاهز ليومك', detail: 'للشغل، واللعب، وكل حاجة' },
  { icon: BatteryFull, title: 'كمّل على راحتك', detail: 'اختار اللي يناسب استخدامك' },
  { icon: Smartphone, title: 'التفاصيل بتفرق', detail: 'لونك. سعتك. اختيارك.' },
];

export function HeroSection() {
  const inquiryUrl = `https://wa.me/${sanitizeWhatsAppNumber()}?text=${encodeURIComponent('أهلًا ملك التفاحه، عايز أعرف موديلات iPhone 18 Pro Max المتاحة والألوان والأسعار.')}`;

  return (
    <section className="king-hero" aria-labelledby="hero-title">
      <div className="king-hero-art" aria-hidden="true">
        <Image src="/branding/iphone-18-burgundy-cinematic.png" alt="" fill priority sizes="100vw" className="king-hero-image" />
      </div>
      <div className="king-hero-inner">
        <div className="king-hero-copy">
          <p className="king-eyebrow" dir="ltr"><span /> THE PRO COLLECTION</p>
          <h1 id="hero-title" dir="ltr">iPhone 18<span>Pro Max</span></h1>
          <div className="king-hero-arabic" dir="rtl">
            <h2>فيه اختيارات بتشبهك.</h2>
            <p>تفاصيل تحبّها، وإحساس مختلف في كل لمسة.<br />خلّينا نساعدك تلاقي الـ iPhone المناسب ليك.</p>
          </div>
          <div className="king-hero-actions">
            <InteractiveSurface className="action-motion"><a href={inquiryUrl} target="_blank" rel="noopener noreferrer" className="king-button king-button-gold"><ArrowRight size={18} /><span>نتكلم على واتساب</span><MessageCircle size={21} /></a></InteractiveSurface>
            <InteractiveSurface className="action-motion"><Link href="/products?brand=Apple&productType=phone" className="king-button king-button-outline"><ArrowRight size={17} /><span>اكتشف الموديلات</span></Link></InteractiveSurface>
          </div>
          <div className="king-highlights" dir="ltr">
            {highlights.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="king-highlight" dir="rtl">
                <span className="king-highlight-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></span>
                <h3>{title}</h3><p>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <a href="#collections" className="king-scroll"><span>شوف أكتر</span><ArrowDown size={19} /></a>
      <span className="king-art-note">تصوّر سينمائي للجهاز · اسألنا عن التوافر</span>
    </section>
  );
}
