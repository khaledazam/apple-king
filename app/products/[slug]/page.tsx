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
      description: 'المنتج المطلوب غير متاح حاليًا في الاستور العام.',
    };
  }

  const title =
    product.seo?.title ||
    `${product.titleAr || product.title} | سعر ومواصفات بالسنبلاوين — ملك التفاحه (أحمد عبد العزيز)`;
  const description =
    product.seo?.description ||
    `تعرف على سعر ${product.titleAr || product.title} اليوم في السنبلاوين لدى متجر ملك التفاحه (أحمد عبد العزيز). أجهزة أصلية كاش وبالتقسيط وضمان معتمد واستلام فوري بشارع مصطفى كامل أمام بن بهاء.`;

  const coverImage = product.coverImage || product.images?.[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king.com';
  const canonicalUrl = `${baseUrl}/products/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ملك التفاحه في مصر — أحمد عبد العزيز (السنبلاوين)',
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

  // Product JSON-LD Structured Data & BreadcrumbList
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king.com';
  const productUrl = `${baseUrl}/products/${slug}`;
  const isUsedOrZero =
    product.variants?.some((v) => v.condition === 'used' || v.condition === 'refurbished') ||
    /كسر|مستعمل/i.test(product.titleAr || product.title);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.titleAr || product.title,
    image: product.images,
    description: product.descriptionAr || product.description,
    url: productUrl,
    sku: product.id || product.slug,
    mpn: product.slug,
    category: product.productType === 'phone' ? 'Smartphones' : 'Mobile Phone Accessories',
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    itemCondition: isUsedOrZero
      ? 'https://schema.org/UsedCondition'
      : 'https://schema.org/NewCondition',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '48',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'EGP',
      price: product.promoPrice || product.basePrice,
      priceValidUntil: '2026-12-31',
      itemCondition: isUsedOrZero
        ? 'https://schema.org/UsedCondition'
        : 'https://schema.org/NewCondition',
      availability:
        product.totalAvailableQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'ElectronicsStore',
        name: 'ملك التفاحه — أحمد عبد العزيز',
        telephone: '+201097976407',
        url: baseUrl,
        address: 'السنبلاوين شارع مصطفي كامل امام بن بهاء',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'الاستور',
        item: `${baseUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.brand,
        item: `${baseUrl}/products?brand=${encodeURIComponent(product.brand)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.titleAr || product.title,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen py-10">
      {/* Inject JSON-LD for Product and Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#6e6e73]">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1d1d1f] transition-colors">
            الاستور
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
