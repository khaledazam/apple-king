// ==============================================================================
// APPLE KING PWA SERVICE WORKER — CACHE & OFFLINE ENGINE
// Version: 2.0.0
// ==============================================================================

const CACHE_NAME = 'apple-king-pwa-v2.0';
const STATIC_ASSETS = [
  '/',
  '/credit',
  '/credit/qr',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/branding/banks/nbe.svg',
  '/branding/banks/banque-misr.svg',
  '/branding/banks/cib.svg',
  '/branding/banks/qnb.svg',
  '/branding/banks/adib.svg'
];

// Install: Pre-cache critical core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[PWA SW] Pre-caching asset failed', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA SW] Purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy:
// - Static assets & images: Cache-first with network fallback
// - Navigation & API: Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass non-GET requests and external tracking
  if (req.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Static Assets / Images: Cache-first
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/branding/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2)$/)
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // HTML Navigation & Pages: Network-First with Cache Fallback
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return res;
      })
      .catch(() => {
        return caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === 'navigate') {
            return caches.match('/');
          }
          return null;
        });
      })
  );
});
