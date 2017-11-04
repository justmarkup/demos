const VERSION = '0.1';

self.addEventListener('install', function(event) {
    console.log(`Service Worker installed`);
    return self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log(`Service Worker activated`);
    return self.clients.claim();
});

const navigatorConnectionSupported = 'connection' in navigator && navigator.connection.effectiveType;

self.addEventListener('fetch', function(event) {
    console.log(`fetch for request ${event.request.url}`);
    // check if the request is an image
    if (/\.jpg$|.png$|.webp$/.test(event.request.url)) {

        // check if navigator.connection is supported
        if (navigatorConnectionSupported) {
            const connectionEffectiveType = navigator.connection.effectiveType;

            // check if effectiveType is supported
            if (connectionEffectiveType) {
                const req = event.request.clone();
                let imageResolution = '';

                switch (connectionEffectiveType) {
                    case "slow-2g":
                    case "2g":
                        imageResolution = '_low';
                        break;
                    case "4g":
                        imageResolution = '_high';
                        break;
                    default:
                        imageResolution = '';
                }

                // Build the image we want to return based on connection
                const returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + imageResolution + "." + req.url.split('.').pop();

                event.respondWith(
                    fetch(returnUrl, {
                        mode: 'no-cors'
                    })
                );

            }

        }
    }
});