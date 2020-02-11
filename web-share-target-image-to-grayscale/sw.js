'use strict';

const version = '1.0';

addEventListener('install', event => {
    skipWaiting();
});

addEventListener('activate', event => {
    clients.claim();
});

addEventListener('fetch', event => {
    if (event.request.method !== 'POST') {
        return;
    }

    if (event.request.url.startsWith('https://justmarkup.com/demos/web-share-target-image-to-grayscale/upload') === false) {
        return;
    }

    event.respondWith(Response.redirect('https://justmarkup.com/demos/web-share-target-image-to-grayscale/output.html'));
    event.waitUntil(async function() {
        const data = await event.request.formData();
        const client = await self.clients.get(event.resultingClientId || event.clientId);

        const file = data.get('file');
        client.postMessage({ file, action: 'load-image' });
    }());
});