import Link from 'next/link';
import { BatteryCharging, Cable, Headphones, Layers, Package, Shield, Zap } from 'lucide-react';
import { ACCESSORY_DEPARTMENTS } from '@/lib/catalog/categories';

const icons = { charger: Zap, case: Layers, cable: Cable, earphone: Headphones, power_bank: BatteryCharging, screen_protector: Shield, other: Package };

export function AccessoryDepartments() {
  return (
    <section className="shop-section accessory-departments" aria-labelledby="accessory-departments-title">
      <div className="shop-heading"><div><p className="shop-eyebrow">FIND YOUR ESSENTIALS</p><h2 id="accessory-departments-title">لكل تفصيلة، قسمها.</h2><p className="accessory-departments-note">للشحن، للصوت، ولحماية جهازك. اختار اللي محتاجه.</p></div></div>
      <nav className="accessory-department-grid" aria-label="أقسام الإكسسوارات">
        {ACCESSORY_DEPARTMENTS.map(({ value, label }) => {
          const Icon = icons[value];
          return <Link key={value} href={`/products?productType=accessory&category=${value}`}><Icon size={30} strokeWidth={1.3} aria-hidden="true" /><strong>{label}</strong><span>استكشف القسم ←</span></Link>;
        })}
      </nav>
    </section>
  );
}
