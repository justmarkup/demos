// insert styles for the ad
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'ad.css';
document.head.appendChild(link);

// get some random ad :-)
var ads = [
	{
		headline: "The best ad ever",
		url: "https://justmarkup.com/log/",
		text:  "Forget everything, this is the best ad ever, click click click"
	},
	{
		headline: "HTML5 rocks!",
		url: "https://justmarkup.com/log/",
		text:  "I want Flash, I want Flash, I want Flash"
	}
];

var divs = document.querySelectorAll('.ad');

// iterate over each ad container and add random ad
[].forEach.call(divs, function(div) {
	var ad = ads[Math.floor(Math.random() * ads.length)];
	div.innerHTML = '<a href="' + ad.url + '"><h3>' + ad.headline + '</h3><p>' + ad.text + '</p></a>';
});
