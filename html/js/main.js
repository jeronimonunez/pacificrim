
jQuery(document).ready(function($) {
	// Stuff to do as soon as the DOM is ready;

	var homeBg = ["home-1.jpg", "home-2.jpg", "home-3.jpg", "home-4.jpg", "home-5.jpg", "home-6.jpg"],
		counter = 0,  // home background position counter

		$intro = $('#intro'),
		$introOverlay = $intro.children('.overlay');

	setInterval(function () {
		console.log(counter);
		$introOverlay.fadeIn(500, function () {
			if (counter==homeBg.length-1) counter=0;
			else counter++;
			$intro.css('background-image', 'url(img/'+homeBg[counter]+')')
			$introOverlay.fadeOut(600);
		})
	}, 5000);
});