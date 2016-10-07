// set a custom text for the error message
var commentArea = document.querySelector("#comment");

commentArea.addEventListener('invalid', function (e) {
	e.target.setCustomValidity("");
	if (!e.target.validity.valid) {
		e.target.setCustomValidity("Please enter a comment.");
	}
});

commentArea.addEventListener('input', function (e) {
	e.target.setCustomValidity("");
});
