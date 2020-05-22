/**
 * ARIA labelledBy
 * Use to easily add relationships between page sections and label text/headings.
 * (Automatically adds ids to elements that don't have them).
 * @version 0.1
 * 
 * @author Andrew Ramsden
 * @see http://irama.org/web/dhtml/aria/labelledby/
 * @license Common Public License Version 1.0 <http://www.opensource.org/licenses/cpl1.0.txt>
 * @requires jQuery (tested with version 1.4.2) <http://jquery.com/>
 * @requires jQuery jARIA plugin <http://outstandingelephant.com/jaria/>
 * 
 * Example use: $('#section').labelledBy('h2'); // #section is labelledby the first h2 within
 */
if (typeof jQuery != 'undefined') { /* Start if jQuery exists */

(function($) { /* start closure */
	
	// init
		landmarkLabelCount = 1;
	
	// jQuery plugin
		$.fn.labelledBy = function (labelledBySelector) {
			$(this).data('labelled-by-selector', labelledBySelector);
			$(this).each(initLabelledBy);
		};
	
	// apply the labelledby relationships
		initLabelledBy = function () {
			labelledBySelector = $(this).data('labelled-by-selector');
			
			// search within first, then if no matches, search globally
				label = $(this).find(labelledBySelector).first();
				if (label.size() == 0) {
					label = $(labelledBySelector).first();
				}
				if (label.size() == 0) {
					return; // matching label not found
				}
				
			
			// if label has no id, give it one
				if (label.attr('id') == '') {
					label.attr('id', 'landmark-label-'+landmarkLabelCount++);
				}
			
			// apply the relationship
				$(this).ariaState('labelledby', label.attr('id'));
		};
	
	
})(jQuery); /* end closure */
} /* end if jQuery exists */