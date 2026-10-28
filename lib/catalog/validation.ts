/**
 * MOBILIX ONLINE STOREFRONT — QUERY VALIDATION & SECURITY DEFENSE
 *
 * Security Implementation:
 * - Rejects any query containing MongoDB operators ($gt, $where, $regex injection, etc.).
 * - Escapes regex special characters to prevent Regular Expression Denial of Service (ReDoS).
 * - Enforces strict bounds on pagination and strict allowlisting of sort parameters.
 * - Validates slugs to prevent path traversal or injection.
 */

import { CatalogQueryParams } from '../../types/catalog';

/**
 * Escapes regex special characters to prevent ReDoS when constructing dynamic queries.
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validates a public product slug.
 * Allows only lowercase alphanumeric characters separated by single hyphens.
 */
export function validateSlug(slug: unknown): { isValid: boolean; sanitized: string } {
  if (typeof slug !== 'string' || !slug.trim()) {
    return { isValid: false, sanitized: '' };
  }

  const clean = slug.trim().toLowerCase();
  const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (clean.length > 120 || !SLUG_REGEX.test(clean)) {
    return { isValid: false, sanitized: '' };
  }

  return { isValid: true, sanitized: clean };
}

/**
 * Validates that an object contains no MongoDB operator keys or path injection ($ or .).
 */
export function sanitizeQueryInput(obj: Record<string, any>): void {
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      throw new Error(`Security Violation: Disallowed query parameter key '${key}'`);
    }

    if (typeof val === 'string' && val.startsWith('$')) {
      throw new Error(`Security Violation: Disallowed operator injection in parameter '${key}'`);
    }

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      sanitizeQueryInput(val);
    }
  }
}

export interface ValidatedCatalogParams {
  search?: string;
  brand?: string;
  category?: string;
  productType?: 'phone' | 'accessory';
  condition?: 'new' | 'used' | 'refurbished';
  storage?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  availability: 'all' | 'in_stock' | 'out_of_stock';
  isFeatured?: boolean;
  sort: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  page: number;
  limit: number;
}

/**
 * Parses and validates raw URLSearchParams into safe, typed CatalogQueryParams.
 */
export function parseAndValidateCatalogParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): ValidatedCatalogParams {
  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const val = searchParams[key];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  // Convert to plain object and run security sanitize check
  const rawObj: Record<string, any> = {};
  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((val, key) => {
      rawObj[key] = val;
    });
  } else {
    Object.assign(rawObj, searchParams);
  }
  sanitizeQueryInput(rawObj);

  // Pagination bounds: page >= 1, limit between 1 and 50 (default 12)
  const rawPage = parseInt(getParam('page') || '1', 10);
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const rawLimit = parseInt(getParam('limit') || '12', 10);
  const limit = Number.isInteger(rawLimit) && rawLimit >= 1 && rawLimit <= 50 ? rawLimit : 12;

  // Sorting allowlist
  const rawSort = getParam('sort');
  const allowedSorts = ['price_asc', 'price_desc', 'newest', 'featured'] as const;
  const sort = allowedSorts.includes(rawSort as any) ? (rawSort as (typeof allowedSorts)[number]) : 'newest';

  // Availability allowlist
  const rawAvail = getParam('availability');
  const allowedAvail = ['all', 'in_stock', 'out_of_stock'] as const;
  const availability = allowedAvail.includes(rawAvail as any)
    ? (rawAvail as (typeof allowedAvail)[number])
    : 'all';

  // Price range validation
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  const rawMin = getParam('minPrice');
  if (rawMin) {
    const parsed = parseFloat(rawMin);
    if (!isNaN(parsed) && parsed >= 0) {
      minPrice = parsed;
    }
  }

  const rawMax = getParam('maxPrice');
  if (rawMax) {
    const parsed = parseFloat(rawMax);
    if (!isNaN(parsed) && parsed >= 0) {
      maxPrice = parsed;
    }
  }

  // Ensure minPrice <= maxPrice if both supplied
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    const temp = minPrice;
    minPrice = maxPrice;
    maxPrice = temp;
  }

  // Search string cleaning
  let search: string | undefined;
  const rawSearch = getParam('search');
  if (rawSearch && rawSearch.trim()) {
    search = rawSearch.trim().slice(0, 100); // Bound search query length to 100 chars
  }

  // Product Type allowlist
  let productType: 'phone' | 'accessory' | undefined;
  const rawType = getParam('productType');
  if (rawType === 'phone' || rawType === 'accessory') {
    productType = rawType;
  }

  // Condition allowlist
  let condition: 'new' | 'used' | 'refurbished' | undefined;
  const rawCondition = getParam('condition');
  if (['new', 'used', 'refurbished'].includes(rawCondition as string)) {
    condition = rawCondition as 'new' | 'used' | 'refurbished';
  }

  // Featured toggle
  let isFeatured: boolean | undefined;
  const rawFeatured = getParam('featured');
  if (rawFeatured === 'true' || rawFeatured === '1') {
    isFeatured = true;
  }

  return {
    search,
    brand: getParam('brand')?.trim().slice(0, 50),
    category: getParam('category')?.trim().slice(0, 50),
    productType,
    condition,
    storage: getParam('storage')?.trim().slice(0, 30),
    color: getParam('color')?.trim().slice(0, 30),
    minPrice,
    maxPrice,
    availability,
    isFeatured,
    sort,
    page,
    limit,
  };
}
