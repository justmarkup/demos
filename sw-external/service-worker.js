// Import polyfill for cache methods missing in some browsers
importScripts('sw-cache-polyfill.js');

// the version - change when you want to update the service worker
const version = 'sw-v3';

console.log('sw worker: hi from service-worker.js');

// The install event
self.addEventListener('install', function(event) {
  console.log('sw install', event);
  event.waitUntil(
    caches.open(version).then(function(cache) {
      console.log('sw cache open', cache);
      return cache.addAll([
        './',
        'styles.css',
        // External resource served over https but with CORS not enabled
        new Request('https://justmarkup.com/azores/img/sao-miguel/big/12.jpg', {mode: 'no-cors'})
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
              return !key.startsWith(version);
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

// The fetch event
self.addEventListener('fetch', function(event) {
  console.log('sw worker: fetch', event);
  var requestURL = new URL(event.request.url);

  event.respondWith(
    caches.open(version).then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});
