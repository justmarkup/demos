/* 
 * Responsive Pop-out Menu
 * https://github.com/justmarkup/demos/responsive-pop-out-menu
 * Copyright (c) 2015 @justmarkup
 * Available under the MIT license
 */

(function (doc) {
	// CTM, only init JavaScript for modern browsers
	if ('visibilityState' in doc) { 

		// Add class to html elment once js is available
		doc.documentElement.className = 'js';
		
		var menuLayer = doc.getElementById('is--menu-layer'),
			menuClose = doc.getElementById('is--menu-close'),
			menuOpen = doc.getElementById('is--menu-open');
		
		function openMenu () {
			menuLayer.className = 'is--menu-opened';
		}

		function closeMenu () {
			menuLayer.className = '';
		}

		menuClose.addEventListener("click", closeMenu, false);
		menuOpen.addEventListener("click", openMenu, false);
	}
}(document));