// Import polyfill for cache methods missing in some browsers
importScripts('sw-cache-polyfill.js');

// the CACHE_NAME + CACHE_VERSION - change when you want to update the service worker
const CACHE_NAME = 'sw-external'
const CACHE_VERSION = '-v7';

console.log('sw worker: hi from service-worker.js');

// The install event
self.addEventListener('install', function(event) {
  console.log('sw install', event);

  // self.skipWaiting called within a ServiceWorker means it won't wait for tabs to stop using the old CACHE_NAME + CACHE_VERSION before it takes over.
  //if (self.skipWaiting) { self.skipWaiting(); }

  event.waitUntil(
    caches.open(CACHE_NAME + CACHE_VERSION).then(function prefill (cache) {
      console.log('sw cache open', cache);
      return cache.addAll([
        './',
        'styles.css',
        // External resource served over https but with CORS not enabled
        new Request('https://justmarkup.com/azores/img/sao-miguel/big/12.jpg')
      ]);
    })
  );
});

// The activate event
self.addEventListener("activate", function(event) {
  console.log('sw worker: activate', event);

  event.waitUntil(
    caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) {
            console.log('key', key);
              return !key.startsWith(CACHE_NAME + CACHE_VERSION);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function() {
        console.log('sw worker: activate complete', event);
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('sw worker: fetch event', event);
  event.respondWith(
    caches.open(CACHE_NAME + CACHE_VERSION).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
