const CACHE_NAME = 'nu-suggestion-offline-final';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
  self.clients.claim();
});

// Fetch (The Magic for PWABuilder)
self.addEventListener('fetch', (event) => {
  // ১. অ্যাপ প্রথমবার ওপেন হওয়ার সময় (Navigation)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html'); // অফলাইনে জোর করে index.html দেখাবে
      })
    );
    return;
  }

  // ২. অন্যান্য ফাইল (CSS, JS, Images) এর জন্য
  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;

      return fetch(event.request).then((networkRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // নতুন কিছু পেলে ক্যাশ করে রাখবে
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, networkRes.clone());
          }
          return networkRes;
        });
      }).catch(() => {
        console.log('Offline and resource not in cache:', event.request.url);
      });
    })
  );
});
