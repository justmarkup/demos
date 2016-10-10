importScripts('idb-keyval.js');

const VERSION = 'v1'

self.addEventListener('install', function(event) {
	self.skipWaiting();
	event.waitUntil(
		caches.open(VERSION).then(function(cache) {
			return cache.addAll([
				'./',
				'./index.html',
				'../style.css',
				'enhanced.js'
			]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	let request = event.request;
	if (request.method !== 'GET') {
		return;
	}
	event.respondWith(
		caches.match(request).then(function(response) {
			return response || fetch(request);
		})
	);
});

self.addEventListener('activate', function(event) {
	if (self.clients && clients.claim) {
		clients.claim();
	}
});

self.addEventListener('sync', function(event) {
	if (event.tag == 'form-post') {
		event.waitUntil(postComment());
	}
});

function postComment() {

	let formData = new FormData();

	idbKeyval.get('name').then(function (data) {
		formData.append( "name", data );
	});
	idbKeyval.get('comment').then(function (data) {
		formData.append( "comment", data );
	});

	fetch("./save",
	{
		method: "POST",
		mode: 'cors',
		body: formData
	})
	.then(function(response) {
		return response;
	})
	.then(function(text) {
		send_message_to_all_clients('success');
	})
	.catch(function(error) {
		send_message_to_all_clients('error');
	});
}

function send_message_to_client(client, msg){
	return new Promise(function(resolve, reject){
		var msg_chan = new MessageChannel();

		msg_chan.port1.onmessage = function(event){
			if(event.data.error){
				reject(event.data.error);
			}else{
				resolve(event.data);
			}
		};

		client.postMessage(msg, [msg_chan.port2]);
	});
}

function send_message_to_all_clients(msg){
	clients.matchAll().then(clients => {
		clients.forEach(client => {
			send_message_to_client(client, msg).then(m => console.log("SW Received Message: "+m));
		})
	})
}
