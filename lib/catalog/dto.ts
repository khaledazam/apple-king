/**
 * MOBILIX ONLINE STOREFRONT — PUBLIC DTO ALLOWLIST & SANITIZATION ENGINE
 *
 * Security Implementation:
 * - Recursive field allowlisting for catalog documents, variants, and branch allocations.
 * - Absolute omission of sensitive ERP data (IMEI, purchase costs, suppliers, customers, internal IDs).
 * - Conservative price policy enforcement during unresolved conflicts.
 */

import {
  PublicCatalogProduct,
  PublicVariant,
  PublicBranchAllocation,
  PublicMediaItem,
} from '../../types/catalog';

/**
 * Sanitizes a raw branch allocation document.
 */
export function sanitizeBranchAllocation(raw: any): PublicBranchAllocation {
  return {
    branchId: String(raw.branchId || ''),
    branchName: String(raw.branchName || ''),
    branchNameAr: String(raw.branchNameAr || ''),
    inStockCount: Math.max(0, Number(raw.inStockCount) || 0),
  };
}

/**
 * Sanitizes a raw variant document.
 * Excludes any internal serial numbers or unit identifiers.
 */
export function sanitizeVariant(raw: any): PublicVariant {
  const price = Math.max(0, Number(raw.price) || 0);
  let promoPrice = raw.promoPrice !== undefined && raw.promoPrice !== null ? Number(raw.promoPrice) : null;

  // Strict Promo Invariant: Promo price must strictly be lower than variant price
  if (promoPrice !== null && promoPrice >= price) {
    promoPrice = null;
  }

  const branchAllocations = Array.isArray(raw.branchAllocations)
    ? raw.branchAllocations.map(sanitizeBranchAllocation)
    : undefined;

  return {
    variantKey: String(raw.variantKey || ''),
    storage: raw.storage ? String(raw.storage).trim() : undefined,
    color: raw.color ? String(raw.color).trim() : undefined,
    condition: ['new', 'used', 'refurbished'].includes(raw.condition) ? raw.condition : 'new',
    availableQuantity: Math.max(0, Number(raw.availableQuantity) || 0),
    price,
    promoPrice,
    hasPriceConflict: Boolean(raw.hasPriceConflict),
    branchAllocations,
  };
}

/**
 * Sanitizes a media item document.
 */
export function sanitizeMediaItem(raw: any): PublicMediaItem {
  return {
    publicId: String(raw.publicId || ''),
    url: String(raw.url || raw.secureUrl || ''),
    secureUrl: String(raw.secureUrl || raw.url || ''),
    format: raw.format ? String(raw.format) : undefined,
    width: raw.width ? Number(raw.width) : undefined,
    height: raw.height ? Number(raw.height) : undefined,
    isCover: Boolean(raw.isCover),
    order: raw.order !== undefined ? Number(raw.order) : 0,
    colorKey: raw.colorKey ? String(raw.colorKey).trim() : undefined,
    storageKey: raw.storageKey ? String(raw.storageKey).trim() : undefined,
    variantKey: raw.variantKey ? String(raw.variantKey).trim() : undefined,
  };
}

/**
 * Transforms a raw MongoDB catalog document into a strictly allowlisted PublicCatalogProduct DTO.
 * Guarantees zero sensitive field leakage.
 */
export function toPublicCatalogProduct(doc: any): PublicCatalogProduct {
  if (!doc) {
    throw new Error('Cannot map null or undefined document to PublicCatalogProduct');
  }

  const basePrice = Math.max(0, Number(doc.basePrice) || 0);
  let promoPrice = doc.promoPrice !== undefined && doc.promoPrice !== null ? Number(doc.promoPrice) : null;

  const hasConflict = Boolean(doc.hasPriceConflict);

  // Section 7 Price Policy:
  // If an active price conflict exists, suppress promotional claims and mark as requiring confirmation
  let requiresPriceConfirmation = false;
  if (hasConflict) {
    requiresPriceConfirmation = true;
    promoPrice = null; // Suppress unverified promo
  } else if (promoPrice !== null && promoPrice >= basePrice) {
    // Promo must strictly be lower than base price
    promoPrice = null;
  }

  // Sanitized variants array
  const variants = Array.isArray(doc.variants)
    ? doc.variants.map(sanitizeVariant)
    : [];

  // Sanitized branch availability array
  const branchAvailability = Array.isArray(doc.branchAvailability)
    ? doc.branchAvailability.map(sanitizeBranchAllocation)
    : [];

  // Sanitized media items
  const media = Array.isArray(doc.media)
    ? doc.media.map(sanitizeMediaItem)
    : undefined;

  // Sanitized image URLs
  const images = Array.isArray(doc.images)
    ? doc.images.map((img: any) => String(img)).filter(Boolean)
    : [];

  const coverImage = doc.coverImage
    ? String(doc.coverImage)
    : images.length > 0
    ? images[0]
    : undefined;

  // Safe specifications map (strings only)
  const specifications: Record<string, string> = {};
  if (doc.specifications && typeof doc.specifications === 'object') {
    for (const [key, val] of Object.entries(doc.specifications)) {
      if (typeof val === 'string' || typeof val === 'number') {
        specifications[key] = String(val);
      }
    }
  }

  // SEO fields
  const seo = {
    title: doc.seo?.title ? String(doc.seo.title) : undefined,
    description: doc.seo?.description ? String(doc.seo.description) : undefined,
    keywords: Array.isArray(doc.seo?.keywords)
      ? doc.seo.keywords.map((k: any) => String(k))
      : undefined,
  };

  const id = doc._id ? doc._id.toString() : String(doc.id || '');

  return {
    id,
    catalogKey: String(doc.catalogKey || ''),
    productType: doc.productType === 'accessory' ? 'accessory' : 'phone',
    slug: String(doc.slug || ''),
    brand: String(doc.brand || ''),
    modelName: String(doc.modelName || ''),
    category: String(doc.category || 'smartphones'),
    title: String(doc.title || doc.modelName || ''),
    titleAr: String(doc.titleAr || doc.title || doc.modelName || ''),
    description: doc.description ? String(doc.description) : undefined,
    descriptionAr: doc.descriptionAr ? String(doc.descriptionAr) : undefined,
    images,
    coverImage,
    media,
    basePrice,
    promoPrice,
    currency: 'EGP',
    totalAvailableQuantity: Math.max(0, Number(doc.totalAvailableQuantity) || 0),
    availabilityStatus: ['in_stock', 'low_stock', 'out_of_stock'].includes(doc.availabilityStatus)
      ? doc.availabilityStatus
      : doc.totalAvailableQuantity > 0
      ? 'in_stock'
      : 'out_of_stock',
    variants,
    branchAvailability,
    isFeatured: Boolean(doc.isFeatured),
    featuredOrder: Number(doc.featuredOrder) || 0,
    specifications,
    seo,
    hasPriceConflict: hasConflict,
    requiresPriceConfirmation,
    lastInventorySync: doc.lastInventorySync
      ? new Date(doc.lastInventorySync).toISOString()
      : undefined,
  };
}
