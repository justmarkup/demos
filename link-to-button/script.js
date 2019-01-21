(function() {
    var dialogOpeners = document.querySelectorAll('[data-open-overlay]') || false;

    if (dialogOpeners && dialogOpeners.length > 0) {
        Array.prototype.forEach.call(dialogOpeners, dialogOpener => {
            var dialogContent = document.querySelector('[data-dialog-content]');
            window.dialog = false;

            dialogOpener.outerHTML = `
                <button data-link="${dialogOpener.href}" class="link-like">
                    ${dialogOpener.textContent}
                </button>
            `;

            dialogOpener = document.querySelector('[data-link="' + dialogOpener.href + '"]')

            if (!window.dialog) {
                var dialogElement = document.getElementById('dialog');
                var mainEl = document.querySelector('#content');
                window.dialog = new A11yDialog(dialogElement, mainEl);

                dialogElement.removeAttribute('hidden');

                window.dialog.on('show', function(dialogEl, event) {
                    console.log('opening the dialog')
                });

                window.dialog.on('hide', function(dialogEl, event) {
                    console.log('closing the dialog');
                    dialogContent.innerHTML = '';
                });
            }

            dialogOpener.addEventListener('click', function(ev) {
                var link = this.dataset.link ? this.dataset.link : false;

                console.log('click', link);

                if (link) {

                    fetch(link)
                        .then(function(response) {
                            return response.text();
                        })
                        .then(function(html) {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(html, "text/html");
                            var pageContent = doc.querySelector('#main');
                            dialogContent.innerHTML = '';

                            if (dialogContent && pageContent) {
                                dialogContent.innerHTML = pageContent.innerHTML;
                                window.dialog.show();
                            } else {
                                document.location = link;
                            }

                        })
                        .catch(function(err) {
                            console.log('Failed to fetch page: ', err);
                            document.location = link;
                        });
                    ev.preventDefault();
                }

            });
        });
    }
}());