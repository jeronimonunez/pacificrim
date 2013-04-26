
jQuery(document).ready(function($) {
	// Stuff to do as soon as the DOM is ready;


    var map = {},
    	preload,
    	loader,
    	manifest,

    	mini = 158,

    	$intro = $('#intro'),
		$introOverlay = $intro.find('.overlay'),
		$introText = $intro.find('.magic'),
		$header = $('#header'),
		$findout = $('.findout');

    function init() {

        // Push each item into our manifest
        manifest = [
        	"img/home-1.jpg", 
        	"img/home-2.jpg", 
        	"img/home-3.jpg", 
        	"img/home-4.jpg", 
        	"img/home-5.jpg", 
        	"img/home-6.jpg"
        ];

        // Create a preloader. There is no manifest added to it up-front, we will add items on-demand.
        preload = new createjs.LoadQueue();

        // Use this instead to use tag loading
        //preload = new createjs.LoadQueue(false);

        preload.addEventListener("complete", handleLoadComplete);
        preload.loadManifest(manifest);

        aboutSetup();
        portfolioSetup();
        aboutFunctionality();
    }

    function aboutSetup () {
    	$('#about').height($(window).height());

    	$('.three-columns').css({
    		'width' 	: $(window).width() - mini,
    		'height' 	: $(window).height(),
    		'left' 		: mini,
    		'position'	: 'absolute',
    		'top'		: 0
    	});
    }

    function portfolioSetup () {
    	$('#portfolio').height($(window).height());

    	$('.three-rows').css({
    		'width' 	: $(window).width() - mini,
    		'height' 	: $(window).height(),
    		'left' 		: mini,
    		'position'	: 'absolute',
    		'top'		: 0
    	});
    }

    function aboutFunctionality () {
    	$('.three-columns > div').click(function(){
    		$that = $(this);
    		if($that.hasClass('active')) $that.removeClass('active').siblings().removeClass('standby');
    		else if($that.hasClass('standby')) $that.removeClass('standby').siblings().removeClass('active standby');
    		else $that.addClass('active').siblings().addClass('standby');
    	});
    }

    function handleLoadComplete(event) {

    	$introText.fadeIn(2000, function () {

    		$introOverlay.fadeOut(1000, function(){
    			startHome();
    			$findout.fadeIn();
    		});

    		$header.removeClass('closed');
    	});

    }

    function startHome () {
    	
		var counter = 0;  // home background position counter

		setInterval(function () {
			console.log(counter);
			$introOverlay.fadeIn(500, function () {
				if ( counter == manifest.length-1 ) counter=0;
				else counter++;
				$intro.css( 'background-image' , 'url('+manifest[counter]+')' );
				$introOverlay.fadeOut(600);
			})
		}, 5000);

		wp();
    }

    function wp() {
    	$('#about').waypoint(function(direction) {
    		$('#nav li a').removeClass('active');
    		$header.removeClass('mini');
		});

    	$('#about').waypoint(function(direction) {
    		$('#nav li a').removeClass('active');
			$('#nav-about').addClass('active');
			$header.addClass('mini');
		});

		$('#team').waypoint(function(direction) {
    		$('#nav li a').removeClass('active');
			$('#nav-team').addClass('active');
			$header.addClass('mini');
		});

		$('#portfolio').waypoint(function(direction) {
    		$('#nav li a').removeClass('active');
			$('#nav-portfolio').addClass('active');
			$header.addClass('mini');
		});

		$('#contact').waypoint(function(direction) {
    		$('#nav li a').removeClass('active');
			$('#nav-contact').addClass('active');
			$header.addClass('mini');
		});
    }

    init();
});