import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { CatalogBrandItem } from '@/types/catalog';

export function BrandShowcase({ brands = [] }: { brands?: CatalogBrandItem[] }) {
  const displayBrands = brands.length ? brands : ['Apple', 'Samsung', 'Xiaomi', 'Anker'].map(name => ({ name, productCount: 0 }));
  return <section className="brand-directory" aria-label="تسوق حسب العلامة التجارية"><div className="shop-container brand-directory-inner"><p>العلامة اللي بتحبها.<span> اختار وابدأ.</span></p><div className="brand-directory-links">{displayBrands.map(brand => <Link key={brand.name} href={`/products?brand=${encodeURIComponent(brand.name)}`}><strong dir="ltr">{brand.name}</strong>{brand.productCount > 0 && <small>{brand.productCount} منتج</small>}</Link>)}</div><Link className="shop-text-link" href="/products">كل العلامات <ChevronLeft size={15} /></Link></div></section>;
}
