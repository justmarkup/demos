// cut the mustard
var form = document.createElement('form');
if ('checkValidity' in form && 'querySelector' in document && 'classList' in document.documentElement) {

    // feedback messages
    var messageComponents = document.querySelectorAll("[data-message]");

    if (messageComponents.length > 0) {

        [].forEach.call(messageComponents, function(message) {
            var messageButton = message.querySelector("[data-close-notification]");

            messageButton.removeAttribute('hidden');

            messageButton.addEventListener("click", function() {
                this.parentElement.hidden = true;
            });
        });
    }

    // form validation
    var inputs = document.querySelectorAll("[data-error]");

    if (inputs.length > 0) {

        var toggleErrorMessage = function(input, hasError) {
            var message = (input.value === '') ? input.dataset.empty : input.dataset.error;
            var oldMessage = document.getElementById("alert-" + input.name);
            var newMessage;

            if (hasError) {
                if (!oldMessage) {
                    newMessage = document.createElement("p");
                    newMessage.setAttribute('role', 'alert');
                    newMessage.classList.add('form__error');
                    newMessage.setAttribute('id', 'alert-' + input.name);
                } else {
                    newMessage = oldMessage;
                }


                newMessage.innerText = message;

                input.setAttribute('aria-describedby', 'alert-' + input.name);
                input.parentElement.appendChild(newMessage);

                input.parentElement.classList.add('has-error');
            } else {

                if (oldMessage) {
                    input.parentElement.removeChild(oldMessage);
                    input.removeAttribute('aria-describedby');
                    input.parentElement.classList.remove('has-error');
                }

            }
        };

        [].forEach.call(inputs, function(input) {

            input.addEventListener("blur", function(event) {

                if (event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON') {
                    return;
                }

                input.checkValidity();

                if (input.checkValidity()) {
                    input.classList.remove("error");
                    input.setAttribute("aria-invalid", "false");
                    toggleErrorMessage(input, false);
                } else {
                    input.classList.add("error");
                    input.setAttribute("aria-invalid", "true");
                    toggleErrorMessage(input, true);
                }
            });
        });
    }

    // toggle password field between type="text" and type="password"
    var togglePasswordButton = document.querySelector('[data-toggle-password]');

    if (togglePasswordButton) {
        var togglePasswordButtonText = togglePasswordButton.querySelector('span');
        var passwordField = document.querySelector('[data-toggle-password-field]');
        togglePasswordButton.removeAttribute('hidden');


        togglePasswordButton.addEventListener('click', function() {
            var isPressed = JSON.parse(this.getAttribute('aria-pressed'));

            if (isPressed) {
                passwordField.setAttribute('type', 'password');
                this.setAttribute('aria-pressed', false);
                togglePasswordButtonText.textContent = 'Show password';
            } else {
                passwordField.setAttribute('type', 'text');
                this.setAttribute('aria-pressed', true);
                togglePasswordButtonText.textContent = 'Hide password';
            }
        });
    }
}