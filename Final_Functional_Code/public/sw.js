/**
 * FinVault Service Worker
 * 
 * This service worker enables offline functionality by
 * caching assets and API responses.
 */

// Cache name version - change this if you update the service worker
const CACHE_NAME = 'finvault-cache-v1';

// Resources to cache on install
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx',
  '/src/App.tsx',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          console.log('[Service Worker] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Helper function to determine if a request is for API
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Helper function to determine if a request is for assets
function isAssetRequest(url) {
  const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  return assetExtensions.some(ext => url.pathname.endsWith(ext));
}

// Helper to create offline response for API
function createOfflineApiResponse(url) {
  // Specific API responses
  if (url.pathname.includes('/api/assets')) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname.includes('/api/liabilities')) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname.includes('/api/budget')) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname.includes('/api/voice-processor')) {
    return new Response(JSON.stringify({
      success: true,
      offlineProcessed: true,
      message: "Voice data processed offline"
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Default empty response
  return new Response(JSON.stringify({ offline: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Fetch event - intercept network requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Strategy based on request type
  if (isApiRequest(url)) {
    // API request - Network first, fallback to cache, then offline response
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Try to get from cache first
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, create an offline response
              return createOfflineApiResponse(url);
            });
        })
    );
  } else if (isAssetRequest(url)) {
    // Asset requests - Cache first, network fallback
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Not in cache, get from network
          return fetch(event.request)
            .then((response) => {
              // Cache the response
              if (response.ok) {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, clonedResponse);
                });
              }
              return response;
            });
        })
    );
  } else {
    // HTML navigation - Network first, cache fallback
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Try to get from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If navigation request, serve index.html
              if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
              }
              // Otherwise, let the error propagate
              return Promise.reject('offline');
            });
        })
    );
  }
});