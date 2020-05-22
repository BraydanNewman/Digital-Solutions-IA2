/**
 * This file ensures that the content column is always longer than the asides.
 * This is a requirement of this design at high resolutions.
 * 
 * TODO: Recalculate after text size changes as well as window resize events.
 * 
 * @requires jquery
 */
if (typeof jQuery != 'undefined') { /* Start if jQuery exists */
(function($) { /* start closure */
	
	checkColumnHeights = function () {
		// if no asides, return
			if ($('.aside').size() == 0) {
				return;
			}
		
		contentEl = $('.article:first .box-sizing .border'); // this design currently only supports a single .article element
		contentEl.css('height', 'auto');
		
		// detect 'large' layout
			if ($('.aside:first').length && $('.aside:first').offset().top > contentEl.offset().top) {
				// we are not in 'large' layout, just return
				return;
			}
		
		// measure height of asides
			asidesHeight = 0;
			$('.aside').each(function(){
				
				asidesHeight += $(this).height();
				
			});
		
		// ensure content is taller
			if (contentEl.height() < asidesHeight) {
				contentEl.css('height', asidesHeight);
			}
		
	};
	
	checkColumnHeights();
	$(window).resize(checkColumnHeights);
	
	
})(jQuery); /* end closure */
} /* end if jQuery exists */