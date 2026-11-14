import { MetadataRoute } from 'next';
import { getPublishedProducts } from '@/lib/catalog/queries';

export const revalidate = 3600; // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apple-king.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/credit`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trade-in`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const { products } = await getPublishedProducts({ limit: 1000, availability: 'all' });

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.lastInventorySync ? new Date(product.lastInventorySync) : new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (_e) {
    return staticRoutes;
  }
}
