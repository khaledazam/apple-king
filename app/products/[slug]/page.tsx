import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductDetailComposition } from '@/components/product/ProductDetailComposition';
import { ProductCard } from '@/components/catalog/ProductCard';
import { getProductBySlug, getProductAvailability, getPublishedProducts } from '@/lib/catalog/queries';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'المنتج غير موجود | ملك التفاحه',
      description: 'المنتج المطلوب غير متاح حاليًا في الكتالوج العام.',
    };
  }

  const title = product.seo?.title || `${product.titleAr || product.title} | ملك التفاحه`;
  const description =
    product.seo?.description ||
    product.descriptionAr ||
    `اشتري ${product.titleAr || product.title} بأفضل سعر كاش معتمد في مصر من فروع ملك التفاحه.`;

  const coverImage = product.coverImage || product.images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // Retrieve published product and branch availability concurrently
  const [product, availabilityData] = await Promise.all([
    getProductBySlug(slug),
    getProductAvailability(slug),
  ]);

  // Section 6: If product is not found or unpublished, return 404
  if (!product) {
    notFound();
  }

  // Load related published products (same brand or category, excluding current product)
  let relatedProducts: any[] = [];
  try {
    const relatedRes = await getPublishedProducts({
      brand: product.brand,
      limit: 5,
      availability: 'all',
    });
    relatedProducts = relatedRes.products.filter((p) => p.slug !== product.slug).slice(0, 4);
  } catch (_e) {
    // Ignore related product query errors
  }

  // Product JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.titleAr || product.title,
    image: product.images,
    description: product.descriptionAr || product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: product.promoPrice || product.basePrice,
      availability:
        product.totalAvailableQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen py-10">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#6e6e73]">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1d1d1f] transition-colors">
            الكتالوج
          </Link>
          <span>/</span>
          <Link
            href={`/products?brand=${encodeURIComponent(product.brand)}`}
            className="hover:text-[#1d1d1f] transition-colors"
          >
            {product.brand}
          </Link>
          <span>/</span>
          <span className="text-[#1d1d1f] font-medium line-clamp-1 max-w-xs">
            {product.titleAr || product.title}
          </span>
        </nav>

        {/* Main Product Details Composition */}
        <ProductDetailComposition product={product} />

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <section className="pt-16 border-t border-black/[0.08] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider font-mono">
                  موديلات مشابهة
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-1 tracking-tight">
                  أجهزة أخرى قد تهمك
                </h2>
              </div>
              <Link
                href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="text-sm text-[#0071e3] hover:underline flex items-center gap-1 font-normal transition-colors"
              >
                <span>المزيد من {product.brand}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
