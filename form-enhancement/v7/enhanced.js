// idb-keyval: https://github.com/jakearchibald/idb-keyval
!function(){"use strict";function e(){return t||(t=new Promise(function(e,n){var t=indexedDB.open("keyval-store",1);t.onerror=function(){n(t.error)},t.onupgradeneeded=function(){t.result.createObjectStore("keyval")},t.onsuccess=function(){e(t.result)}})),t}function n(n,t){return e().then(function(e){return new Promise(function(r,o){var u=e.transaction("keyval",n);u.oncomplete=function(){r()},u.onerror=function(){o(u.error)},t(u.objectStore("keyval"))})})}var t,r={get:function(e){var t;return n("readonly",function(n){t=n.get(e)}).then(function(){return t.result})},set:function(e,t){return n("readwrite",function(n){n.put(t,e)})},delete:function(e){return n("readwrite",function(n){n.delete(e)})},clear:function(){return n("readwrite",function(e){e.clear()})},keys:function(){var e=[];return n("readonly",function(n){(n.openKeyCursor||n.openCursor).call(n).onsuccess=function(){this.result&&(e.push(this.result.key),this.result.continue())}}).then(function(){return e})}};"undefined"!=typeof module&&module.exports?module.exports=r:self.idbKeyval=r}();

var commentArea = document.querySelector("#comment");
var nameInput = document.querySelector("#name");
var form = document.querySelector('form');
var messageElement = document.querySelector('#feedback');
var progressWidth;

// set a custom text for the error message
commentArea.addEventListener('invalid', function (e) {
	e.target.setCustomValidity("");
	if (!e.target.validity.valid) {
		e.target.setCustomValidity("Please enter a comment.");
	}
});

commentArea.addEventListener('input', function (e) {
	e.target.setCustomValidity("");
});

// helper function to append comment to existing comments
var appendComment = function (nameValue, commentValue) {
	var comment = document.createElement('li');
	var commentName = document.createElement('h4');
	var commentComment = document.createElement('p');
	var commentWrapper = document.querySelector('.comments');
	commentName.innerText = nameValue;
	commentComment.innerText = commentValue;
	nameValue ? comment.appendChild(commentName) : '';
	comment.appendChild(commentComment);
	commentWrapper.appendChild(comment);
};

// check for service worker support
if ('serviceWorker' in navigator) {
	// register the service worker
	navigator.serviceWorker.register('./service-worker.js');

	form.addEventListener('submit', function (ev) {

		let formData = new FormData(form);
		// send message via BackgroundSync
		navigator.serviceWorker.ready.then(function(swRegistration) {
			console.log('service worker ready');

			idbKeyval.set('comment', commentArea.value);
			idbKeyval.set('name', nameInput.value ? nameInput.value : false);
			messageElement.className = 'message info';
			messageElement.textContent = 'It seems you are offline. Comment will be published automatically once you are online again.';
			
			return swRegistration.sync.register('form-post');
		}); 

		// always call preventDefault at the end, see: http://molily.de/javascript-failure/
		ev.preventDefault();
	});

	// event to receive messages send by service worker
	navigator.serviceWorker.addEventListener('message', function(event){
		if (event.data == 'success') {
			messageElement.className = 'message success';
			messageElement.textContent = 'Your comment was posted sucessfully.';
			let nameValue = false;
			idbKeyval.get('name').then(function (data) {
				nameValue = data;
				let commentValue = '';
				idbKeyval.get('comment').then(function (data) {
					commentValue = data;
					appendComment(nameValue, commentValue);
				});
			});
			
		} else if (event.data == 'error') {
			messageElement.className = 'message error';
			messageElement.textContent = 'There was an error posting the comment. Please try again later.';
		}
	});


} else if ( window.FormData) {

	form.addEventListener('submit', function (ev) {
		var formData = new FormData(form);
		commentValue = commentArea.value;
		nameValue = nameInput.value;

		var xhr = new XMLHttpRequest();
		// save the comment in the database
		xhr.open('POST', './save', true);
		xhr.onload = function () {
			appendComment(nameValue, commentValue);
		};
		xhr.onerror = function (error) {
			messageElement.className = 'message error';
			messageElement.textContent = 'There was an error posting the comment. Please try again later.';
		};
		xhr.upload.onprogress = function (evt) {
			messageElement.className = 'message info';
			messageElement.textContent = 'Uploading: ' + parseInt(evt.loaded/evt.total*100, 10) + '%';
		};
		xhr.upload.onloadend = function (evt) {
			if ('serviceWorker' in navigator && !navigator.onLine && !navigator.serviceWorker.controller) {
				
			} else {
				messageElement.className = 'message success';
				messageElement.textContent = 'Your comment was posted sucessfully.';
			}
		};
		xhr.send(formData);

		// always call preventDefault at the end, see: http://molily.de/javascript-failure/
		ev.preventDefault();
	});
}

// auto-expand the textarea
commentArea.addEventListener('keydown', autosize);

function autosize(){
	var el = this;
	setTimeout(function(){
		el.style.cssText = 'height:auto;';
		el.style.cssText = 'height:' + el.scrollHeight + 'px';
	},0);
}


