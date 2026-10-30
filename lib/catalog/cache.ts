/**
 * MOBILIX ONLINE STOREFRONT — CACHING & DATA FRESHNESS STRATEGY
 *
 * Architecture Invariant:
 * The public storefront runs independently in the cloud while the local ERP runs on the client's PC.
 * If the local ERP backend is turned off or offline, public catalog reads continue seamlessly
 * from MongoDB Atlas. This module manages cache policies and provides stale data indicators.
 */

// Publishing and unpublishing in the ERP must take effect on the next request.
export const CACHE_POLICIES = {
  LISTING: 'no-store, max-age=0',
  DETAIL: 'no-store, max-age=0',
  FEATURED: 'no-store, max-age=0',
  FILTERS: 'no-store, max-age=0',
  AVAILABILITY: 'no-store, max-age=0',
  HEALTH: 'no-cache, no-store, must-revalidate',
} as const;

export const MAX_FRESH_MINUTES = 60; // 1 hour threshold before warning of stale inventory

export interface FreshnessEvaluation {
  isFresh: boolean;
  isStale: boolean;
  elapsedMinutes: number | null;
  lastSyncFormatted: string | null;
  freshnessNote?: string;
  freshnessNoteAr?: string;
}

/**
 * Evaluates the freshness of a product or the catalog based on lastInventorySync.
 */
export function evaluateFreshness(lastSyncDate?: Date | string | null): FreshnessEvaluation {
  if (!lastSyncDate) {
    return {
      isFresh: false,
      isStale: true,
      elapsedMinutes: null,
      lastSyncFormatted: null,
      freshnessNote: 'Inventory synchronization status unverified. Please confirm item availability via WhatsApp.',
      freshnessNoteAr: 'حالة مزامنة المخزون غير مؤكدة حالياً. يُرجى تأكيد توافر المنتج مباشرة عبر الواتساب.',
    };
  }

  const syncTime = new Date(lastSyncDate).getTime();
  if (isNaN(syncTime)) {
    return {
      isFresh: false,
      isStale: true,
      elapsedMinutes: null,
      lastSyncFormatted: null,
    };
  }

  const now = Date.now();
  const elapsedMs = Math.max(0, now - syncTime);
  const elapsedMinutes = Math.floor(elapsedMs / (60 * 1000));
  const isStale = elapsedMinutes > MAX_FRESH_MINUTES;

  let freshnessNote: string | undefined;
  let freshnessNoteAr: string | undefined;

  if (isStale) {
    freshnessNote = `Inventory was last synchronized ${elapsedMinutes} minutes ago. Quantities may vary in store.`;
    freshnessNoteAr = `تم آخر تحديث للمخزون منذ ${elapsedMinutes} دقيقة. قد يختلف التوافر الفعلي في الفروع. يُرجى التأكيد عبر الواتساب.`;
  }

  return {
    isFresh: !isStale,
    isStale,
    elapsedMinutes,
    lastSyncFormatted: new Date(syncTime).toISOString(),
    freshnessNote,
    freshnessNoteAr,
  };
}
