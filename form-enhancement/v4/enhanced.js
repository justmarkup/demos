// set a custom text for the error message
var commentArea = document.querySelector("#comment");
var nameInput = document.querySelector("#name");
var form = document.querySelector('form');
var commentValue, nameValue;

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
		var commentName = document.createElement('h4');
		var commentComment = document.createElement('p');
		var commentWrapper = document.querySelector('.comments');
		commentName.innerText = nameValue;
		commentComment.innerText = commentValue;
		nameValue ? comment.appendChild(commentName) : '';
		comment.appendChild(commentComment);
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
		xhr.send(formData);

		// always call preventDefault at the end, see: http://molily.de/javascript-failure/
		ev.preventDefault();
	});
}


