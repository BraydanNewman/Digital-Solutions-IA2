/**
 * This file contains general initialisation and configuration to be 
 * run on page load (or just before </body>). Where initialisation is
 * required sooner than this (for example: the transformer layout script
 * for IE 6-8 must be initialised ASAP to avoid flicker), scripts have 
 * been loaded in the head and initialised just after <body> for the 
 * relevant browsers using conditional comments.
 * 
 * This file also contains some simple functionality like show/hide
 * #access keys or ARIA roles/relationships that didn't warrant a 
 * separate javascript file.
 * 
 * @requires jquery
 * @requires jquery.aria.js
 * @requires jquery.aria.key-nav.js
 * @requires jquery.aria.labelledby.js
 * @requires jquery.print-link-urls.js
 * @requires jquery.qg-drop-down.js
 * @requires jquery.page-options.js
 */
if (typeof jQuery == 'undefined') {
	if (typeof console != 'undefined' && typeof console.log != 'undefined') {
		console.log('Queensland Government template behaviours failed to initialise. jQuery is not available');
	}
} else { (function($) { /* start closure */	
	// Init section navigation
		// currentPageTitle = ''; // override value of H1 as page title
	
	// Init script only page options enhancements
		$.enhancePageOptions();
		
	// Init drop downs (site navigation and page options)
		$('#nav-site, .page-options').qgDropDown();
	
	
	// Init access keys
		$('#access')
			.addClass('hidden')
			.bind('focusin', function(){
				$('#access').addClass('visible');
			})
			.bind('focusout', function(){
				$('#access').removeClass('visible');
			})
		;
	
	// Call the function to add in print frienldy url text for all content links
	// (exclude the breadcrumbs and page-options)
		printLinkMaxURLLength = 200; // the maximum length of a URL that we will print
		$('#content-container a, #footer a')
			.not('#breadcrumbs a, .page-options a, #fat-footer a')
				.printLinkURLs();
		
		

	// Add ARIA landmark roles to elements that require semantic clarification.
		// Landmark roles
			$('#header').ariaRole('banner');
			$('#tools, #nav-site, #nav-section, #breadcrumbs, #fat-footer').ariaRole('navigation');
			$('#search-form, .search-box-group').ariaRole('search');
			$('#footer').ariaRole('contentinfo');
			$('#content').ariaRole('main');
			$('.article').ariaRole('article'); // article is sub-role of document
			$('.application #content .article, #content.application .article').ariaRole('application'); // application role should replace article role for applications
			$('.aside').ariaRole('complementary');
			$('.max-width, .box-sizing').ariaRole('presentation');
		
		// Landmark labels
			$('#access, #header, #nav-site, #nav-section, #breadcrumbs, #fat-footer, .aside, #page-feedback').labelledBy('h2'); // #tools is not labelled at this time
			$('#nav-site ul li, .page-options ul li').labelledBy('a'); // the first link within is the label
			$('#fat-footer .section').labelledBy('h3');
			$('#content, .article').labelledBy(':header');
			$('.search-scope, #page-feedback .select1 fieldset').labelledBy('strong');
			$('#footer').labelledBy('h2:not(#fat-footer h2)');
	
	
	
	// Supplement media query support for (currently webkit) browsers
	// that don't recalculate media queries on zoom.
	// Use a timeout so that this event is not fired repeatedly
	// during window resize events.
	// Remove this script once webkit browsers commonly don't need this
	// supplement and/or uncomment the version test below and add the
	// appropriate webkit version which no longer requires this supplement.
		if ($.browser.webkit /* && $.browser.version < 540*/) {
			zoomTimeoutId = null;
			$(window).resize(function () {
				if (zoomTimeoutId != null) {
					window.clearTimeout(zoomTimeoutId);
				}
				zoomTimeoutId = window.setTimeout(function(){
					triggerRecalc = $('<style type="text/css">');
					$('head')
						.prepend(triggerRecalc)
						.remove(triggerRecalc)
					;
				}, 300);
			});
		}
	
})(jQuery); /* end closure */
} /* end if jQuery exists */
