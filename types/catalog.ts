/**
 * MOBILIX ONLINE STOREFRONT — PUBLIC CATALOG TYPES & DTO DEFINITIONS
 *
 * Strict Public Data Policy:
 * Only sanitized, approved catalog fields may appear in these interfaces.
 * Physical device IMEIs, internal cost/purchase prices, supplier references,
 * customer records, employee IDs, repair logs, and unresolved price conflict
 * internal rationale are strictly excluded.
 */

export type StorefrontProductType = 'phone' | 'accessory';

export type StorefrontDeviceCondition = 'new' | 'used' | 'refurbished';

export type StorefrontAvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface PublicBranchAllocation {
  branchId: string;
  branchName: string;
  branchNameAr: string;
  inStockCount: number;
}

export interface PublicVariant {
  variantKey: string;
  storage?: string;
  color?: string;
  condition: StorefrontDeviceCondition;
  availableQuantity: number;
  price: number;
  promoPrice?: number | null;
  hasPriceConflict?: boolean;
  branchAllocations?: PublicBranchAllocation[];
}

export interface PublicMediaItem {
  publicId: string;
  url: string;
  secureUrl: string;
  format?: string;
  width?: number;
  height?: number;
  isCover?: boolean;
  order?: number;
  colorKey?: string;
  storageKey?: string;
  variantKey?: string;
}

export interface PublicCatalogProduct {
  id: string;
  catalogKey: string;
  productType: StorefrontProductType;
  slug: string;
  brand: string;
  modelName: string;
  category: string;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  images: string[];
  coverImage?: string;
  media?: PublicMediaItem[];
  basePrice: number;
  promoPrice?: number | null;
  currency: string;
  totalAvailableQuantity: number;
  availabilityStatus: StorefrontAvailabilityStatus;
  variants: PublicVariant[];
  branchAvailability: PublicBranchAllocation[];
  isFeatured: boolean;
  featuredOrder: number;
  specifications: Record<string, string>;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  hasPriceConflict?: boolean;
  requiresPriceConfirmation?: boolean;
  lastInventorySync?: string;
}

export interface CatalogFilterOptions {
  brands: string[];
  categories: string[];
  productTypes: string[];
  conditions: StorefrontDeviceCondition[];
  storageOptions: string[];
  colors: string[];
  priceRange: {
    min: number;
    max: number;
  };
  totalPublishedProducts: number;
}

export interface CatalogQueryParams {
  search?: string;
  brand?: string;
  category?: string;
  productType?: StorefrontProductType;
  condition?: StorefrontDeviceCondition;
  storage?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: 'all' | 'in_stock' | 'out_of_stock';
  isFeatured?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  page?: number;
  limit?: number;
}

export interface PaginatedCatalogResponse {
  products: PublicCatalogProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  appliedFilters: {
    search?: string;
    brand?: string;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    availability?: string;
    sort?: string;
  };
}

export interface CatalogBrandItem {
  name: string;
  productCount: number;
}

export interface PublicProductAvailability {
  slug: string;
  productName: string;
  productNameAr: string;
  totalAvailableQuantity: number;
  availabilityStatus: StorefrontAvailabilityStatus;
  branchAvailability: PublicBranchAllocation[];
  lastInventorySync?: string;
  isStale?: boolean;
  freshnessNote?: string;
}

export interface PublicApiHealth {
  status: 'ok' | 'degraded';
  timestamp: string;
  version: string;
  database: {
    connected: boolean;
    collection: string;
  };
  freshness: {
    lastCatalogSync?: string;
    isFresh: boolean;
  };
}
