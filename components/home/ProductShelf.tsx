import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import type { PublicCatalogProduct } from '@/types/catalog';

interface ProductShelfProps { id: string; title: string; subtitle: string; eyebrow: string; href: string; products: PublicCatalogProduct[]; featured?: boolean; }
export function ProductShelf({ id, title, subtitle, eyebrow, href, products, featured = false }: ProductShelfProps) {
  if (products.length === 0) return null;
  return <section id={id} className="shop-section product-shelf" aria-labelledby={`${id}-title`}><div className="shop-heading"><div><p className="shop-eyebrow">{eyebrow}</p><h2 id={`${id}-title`}>{title}</h2><p className="shop-section-description">{subtitle}</p></div><Link href={href} className="shop-text-link">عرض الكل <ChevronLeft size={16} /></Link></div><div className="shop-product-grid">{products.map(product => <ProductCard key={product.id} product={product} featured={featured} />)}</div></section>;
}
