(global => {
	'use strict';

	importScripts('bower_components/sw-toolbox/sw-toolbox.js');

	global.toolbox.options.debug = true;

	global.toolbox.router.get(/article-/, global.toolbox.cacheFirst, {
		// Use a dedicated cache for the responses, separate from the default cache.
		cache: {
			name: 'articles',
			// Store up to 10 articles in that cache.
			maxEntries: 10
		}
	});

	global.toolbox.router.default = global.toolbox.networkFirst;

	// Boilerplate to ensure our service worker takes control of the page as soon
	// as possible.
	global.addEventListener('install',
			event => event.waitUntil(global.skipWaiting()));
	global.addEventListener('activate',
			event => event.waitUntil(global.clients.claim()));

})(self);
