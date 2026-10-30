import { InteractiveSurface } from '@/components/ui/MotionPrimitives';
import Link from 'next/link';
import Image from '@/components/ui/CatalogImage';
import { ChevronLeft, Smartphone, Headphones, Cable, BatteryCharging, Sparkles, SlidersHorizontal } from 'lucide-react';
import type { PublicCatalogProduct } from '@/types/catalog';

const shortcuts = [
  { title: 'iPhone', href: '/products?brand=Apple&productType=phone', icon: Smartphone },
  { title: 'Samsung', href: '/products?brand=Samsung&productType=phone', icon: Smartphone },
  { title: 'سماعات', href: '/products?productType=accessory&category=earphone', icon: Headphones },
  { title: 'شواحن', href: '/products?productType=accessory&category=charger', icon: Cable },
  { title: 'باور بانك', href: '/products?productType=accessory&category=power_bank', icon: BatteryCharging },
  { title: 'أجهزة مستعملة', href: '/products?condition=used', icon: Sparkles },
];

export function CategoryShowcase({ phones = [] }: { phones?: PublicCatalogProduct[] }) {
  const samsungImage = phones.find(p => p.brand.toLowerCase() === 'samsung' && (p.coverImage || p.images[0]));
  return (
    <section id="collections" className="shop-section" aria-labelledby="departments-title">
      <div className="shop-heading"><div><p className="shop-eyebrow">THE COLLECTIONS</p><h2 id="departments-title">كل اللي بتدور عليه.<span> في مكان واحد.</span></h2></div><Link href="/products" className="shop-text-link">تصفح الكتالوج <ChevronLeft size={16} /></Link></div>
      <nav className="shop-shortcuts" aria-label="أقسام التسوق">{shortcuts.map(({ title, href, icon: Icon }) => <Link href={href} key={title}><span><Icon size={27} strokeWidth={1.35} aria-hidden="true" /></span><strong>{title}</strong></Link>)}</nav>
      <div className="department-grid">
        <InteractiveSurface>
        <Link href="/products?brand=Apple&productType=phone" className="department-card department-dark">
          <div className="department-copy"><p className="shop-eyebrow">THE iPHONE EDIT</p><h3>عالم iPhone.</h3><p>من أول تجربة، لآخر تفصيلة.<br />اكتشف الموديل اللي يناسبك.</p><span className="department-action">استكشف iPhone <ChevronLeft size={17} /></span></div>
          <Image src="/branding/gold-iphone-hero.png" alt="تكوين توضيحي لهواتف بلون ذهبي" fill sizes="(max-width: 760px) 100vw, 50vw" className="department-image" />
        </Link>
        </InteractiveSurface>
        <InteractiveSurface>
        <Link href="/products?productType=accessory" className="department-card department-cream">
          <div className="department-copy"><p className="shop-eyebrow">THE EVERYDAY ESSENTIALS</p><h3>كمّل تجربتك.</h3><p>للصوت، للشحن، ولحماية جهازك.<br />تفاصيل صغيرة بتفرق في يومك.</p><span className="department-action">تسوق الإكسسوارات <ChevronLeft size={17} /></span></div>
          <Image src="/branding/accessories-editorial.png" alt="تكوين توضيحي لسماعات وشاحن وكابل وغطاء هاتف" fill sizes="(max-width: 760px) 100vw, 50vw" className="department-image" />
        </Link>
        </InteractiveSurface>
      </div>
      <div className="department-bottom">
        <Link href="/products?brand=Samsung&productType=phone" className="department-mini">
          {samsungImage ? <Image src={samsungImage.coverImage || samsungImage.images[0]} width={76} height={92} alt="" className="mini-device-image" /> : <Smartphone size={45} strokeWidth={1} aria-hidden="true" />}
          <div><span>Samsung Galaxy</span><h3>اختيارات أكتر. إمكانيات أوسع.</h3><p>تصفح هواتف سامسونج المتاحة.</p></div><ChevronLeft size={20} />
        </Link>
        <Link href="/products" className="department-mini department-mini-warm"><SlidersHorizontal size={36} strokeWidth={1.3} aria-hidden="true" /><div><span>اختيار على مقاسك</span><h3>عارف بتدور على إيه؟</h3><p>حدد العلامة، الحالة، السعة والسعر من الكتالوج.</p></div><ChevronLeft size={20} /></Link>
      </div>
    </section>
  );
}
