/**
 * MOBILIX ONLINE STOREFRONT — SECURE PUBLIC CATALOG QUERIES
 *
 * Architecture Invariant:
 * Strictly queries the read-only `storefrontproducts` collection.
 * Only documents with `isPublished: true` are ever returned.
 * All results pass through `toPublicCatalogProduct` for strict allowlisting.
 */

import { getStorefrontCollection } from '@/lib/db/mongodb';
import { toPublicCatalogProduct } from './dto';
import { escapeRegex, ValidatedCatalogParams } from './validation';
import { evaluateFreshness } from './cache';
import {
  PublicCatalogProduct,
  PaginatedCatalogResponse,
  CatalogFilterOptions,
  CatalogBrandItem,
  PublicProductAvailability,
} from '@/types/catalog';

/**
 * Retrieves paginated published products with flexible, safe filtering.
 */
export async function getPublishedProducts(
  params: Partial<ValidatedCatalogParams> = {}
): Promise<PaginatedCatalogResponse> {
  const collection = await getStorefrontCollection();

  const page = params.page && params.page >= 1 ? params.page : 1;
  const limit = params.limit && params.limit >= 1 ? params.limit : 12;
  const sort = params.sort || 'newest';
  const availability = params.availability || 'all';

  // Strict Publication Guard: only published products are accessible
  const query: Record<string, any> = {
    isPublished: true,
  };

  // Brand filter
  if (params.brand) {
    query.brand = params.brand;
  }

  // Category filter
  if (params.category) {
    query.category = params.category;
  }

  // Product Type filter
  if (params.productType) {
    query.productType = params.productType;
  }

  // Condition filter
  if (params.condition) {
    query['variants.condition'] = params.condition;
  }

  // Storage capacity filter
  if (params.storage) {
    query['variants.storage'] = params.storage;
  }

  // Color filter
  if (params.color) {
    query['variants.color'] = params.color;
  }

  // Featured toggle
  if (params.isFeatured) {
    query.isFeatured = true;
  }

  // Availability filter
  if (availability === 'in_stock') {
    query.totalAvailableQuantity = { $gt: 0 };
    query.availabilityStatus = { $in: ['in_stock', 'low_stock'] };
  } else if (availability === 'out_of_stock') {
    query.$or = [
      { availabilityStatus: 'out_of_stock' },
      { totalAvailableQuantity: 0 },
    ];
  }

  // Price range filter
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    query.basePrice = {};
    if (params.minPrice !== undefined) {
      query.basePrice.$gte = params.minPrice;
    }
    if (params.maxPrice !== undefined) {
      query.basePrice.$lte = params.maxPrice;
    }
  }

  // Search filter (supports Arabic and English search across multiple fields)
  if (params.search) {
    const escaped = escapeRegex(params.search);
    const searchRegex = new RegExp(escaped, 'i');
    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { title: searchRegex },
          { titleAr: searchRegex },
          { brand: searchRegex },
          { modelName: searchRegex },
          { description: searchRegex },
          { descriptionAr: searchRegex },
        ],
      },
    ];
  }

  // Sorting definition
  const sortOptions: Record<string, any> = {};
  switch (sort) {
    case 'price_asc':
      sortOptions.basePrice = 1;
      sortOptions._id = 1;
      break;
    case 'price_desc':
      sortOptions.basePrice = -1;
      sortOptions._id = -1;
      break;
    case 'featured':
      sortOptions.isFeatured = -1;
      sortOptions.featuredOrder = 1;
      sortOptions.updatedAt = -1;
      break;
    case 'newest':
    default:
      sortOptions.createdAt = -1;
      sortOptions._id = -1;
      break;
  }

  const skip = (page - 1) * limit;

  const [rawDocs, total] = await Promise.all([
    collection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(query),
  ]);

  const products = rawDocs.map(toPublicCatalogProduct);
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    appliedFilters: {
      search: params.search,
      brand: params.brand,
      category: params.category,
      condition: params.condition,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      availability: availability !== 'all' ? availability : undefined,
      sort,
    },
  };
}

/**
 * Retrieves a single published product by its slug.
 * Returns null if not found or if unpublished.
 */
export async function getProductBySlug(slug: string): Promise<PublicCatalogProduct | null> {
  const collection = await getStorefrontCollection();

  // Strict Publication Guard: isPublished MUST be true
  const doc = await collection.findOne({
    slug: slug.trim().toLowerCase(),
    isPublished: true,
  });

  if (!doc) {
    return null;
  }

  return toPublicCatalogProduct(doc);
}

/**
 * Retrieves featured published products ordered by featuredOrder.
 */
export async function getFeaturedProducts(limit = 8): Promise<PublicCatalogProduct[]> {
  const collection = await getStorefrontCollection();
  const boundedLimit = Math.max(1, Math.min(24, limit));

  const docs = await collection
    .find({
      isPublished: true,
      isFeatured: true,
    })
    .sort({ featuredOrder: 1, updatedAt: -1 })
    .limit(boundedLimit)
    .toArray();

  return docs.map(toPublicCatalogProduct);
}

/**
 * Aggregates available filter options across all published catalog products.
 */
export async function getCatalogFilters(): Promise<CatalogFilterOptions> {
  const collection = await getStorefrontCollection();

  const pipeline = [
    { $match: { isPublished: true } },
    {
      $facet: {
        brands: [{ $group: { _id: '$brand' } }, { $sort: { _id: 1 } }],
        categories: [{ $group: { _id: '$category' } }, { $sort: { _id: 1 } }],
        productTypes: [{ $group: { _id: '$productType' } }],
        conditions: [
          { $unwind: '$variants' },
          { $group: { _id: '$variants.condition' } },
        ],
        storageOptions: [
          { $unwind: '$variants' },
          { $match: { 'variants.storage': { $ne: null } } },
          { $group: { _id: '$variants.storage' } },
          { $sort: { _id: 1 } },
        ],
        colors: [
          { $unwind: '$variants' },
          { $match: { 'variants.color': { $ne: null } } },
          { $group: { _id: '$variants.color' } },
          { $sort: { _id: 1 } },
        ],
        priceBounds: [
          {
            $group: {
              _id: null,
              minPrice: { $min: '$basePrice' },
              maxPrice: { $max: '$basePrice' },
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ];

  const [result] = await collection.aggregate(pipeline).toArray();

  const brands = (result?.brands || []).map((b: any) => b._id).filter(Boolean);
  const categories = (result?.categories || []).map((c: any) => c._id).filter(Boolean);
  const productTypes = (result?.productTypes || []).map((p: any) => p._id).filter(Boolean);
  const conditions = (result?.conditions || []).map((c: any) => c._id).filter(Boolean);
  const storageOptions = (result?.storageOptions || []).map((s: any) => s._id).filter(Boolean);
  const colors = (result?.colors || []).map((c: any) => c._id).filter(Boolean);

  const priceStats = result?.priceBounds?.[0];
  const min = priceStats?.minPrice !== undefined ? priceStats.minPrice : 0;
  const max = priceStats?.maxPrice !== undefined ? priceStats.maxPrice : 100000;
  const totalPublishedProducts = priceStats?.count || 0;

  return {
    brands,
    categories,
    productTypes,
    conditions,
    storageOptions,
    colors,
    priceRange: { min, max },
    totalPublishedProducts,
  };
}

/**
 * Aggregates all brands with published product counts.
 */
export async function getCatalogBrands(): Promise<CatalogBrandItem[]> {
  const collection = await getStorefrontCollection();

  const pipeline = [
    { $match: { isPublished: true } },
    {
      $group: {
        _id: '$brand',
        productCount: { $sum: 1 },
      },
    },
    { $sort: { productCount: -1, _id: 1 } },
  ];

  const results = await collection.aggregate(pipeline).toArray();

  return results
    .filter((r) => r._id)
    .map((r) => ({
      name: String(r._id),
      productCount: Number(r.productCount) || 0,
    }));
}

/**
 * Retrieves sanitized branch-level availability for a single published product.
 */
export async function getProductAvailability(slug: string): Promise<PublicProductAvailability | null> {
  const product = await getProductBySlug(slug);
  if (!product) {
    return null;
  }

  const freshness = evaluateFreshness(product.lastInventorySync);

  return {
    slug: product.slug,
    productName: product.title,
    productNameAr: product.titleAr,
    totalAvailableQuantity: product.totalAvailableQuantity,
    availabilityStatus: product.availabilityStatus,
    branchAvailability: product.branchAvailability,
    lastInventorySync: product.lastInventorySync,
    isStale: freshness.isStale,
    freshnessNote: freshness.freshnessNoteAr || freshness.freshnessNote,
  };
}
