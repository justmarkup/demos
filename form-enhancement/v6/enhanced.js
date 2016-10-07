// set a custom text for the error message
var commentArea = document.querySelector("#comment");
var nameInput = document.querySelector("#name");
var form = document.querySelector('form');
var messageElement = document.querySelector('#feedback');
var progressWidth;

commentArea.addEventListener('invalid', function (e) {
	e.target.setCustomValidity("");
	if (!e.target.validity.valid) {
		e.target.setCustomValidity("Please enter a comment.");
	}
});

commentArea.addEventListener('input', function (e) {
	e.target.setCustomValidity("");
});


// send form data with JavaScript
if( window.FormData) {

	var appendComment = function (nameValue, commentValue) {
		var comment = document.createElement('li');
		var commentWrapper = document.querySelector('.comments');
		nameValue = nameValue ? '<h4>' + nameValue + '</h4>' : '';
		comment.innerHTML = nameValue + '<p>' + commentValue + '</p>';
		commentWrapper.appendChild(comment);
	};

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
			messageElement.textContent = 'There was an error posting the comment. Please try again.';
		};
		xhr.upload.onprogress = function (evt) {
			messageElement.textContent = 'Uploading: ' + evt.loaded/evt.total*100;
		};
		xhr.upload.onloadend = function (evt) {
			messageElement.className = 'message success';
			messageElement.textContent = 'Your comment was posted sucessfully.';
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
