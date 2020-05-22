/**
 * jquery.keyboard-focus.js (defines classes for when focus was obtained via the keyboard)
 * 
 * @version 0.3
 * Changelog:
 *   * 0.1 Initial implementation
 *   * 0.2 Added support for 'focus' class to appear whenever an element is foccued. 
 *     Useful for browsers like IE6 that don't support :focus
 *   * 0.3 Added support for 'mouse-focus' class so that :focus styles can be strong for keyboard by default
 *     with more subtle style for .mouse-focus events.
 * 
 * @author Andrew Ramsden
 * @see http://irama.org/web/dhtml/key-focus/
 * @license Common Public License Version 1.0 <http://www.opensource.org/licenses/cpl1.0.txt>
 * @requires jQuery (tested with version 1.3.1) <http://jquery.com/>
 */

if (typeof jQuery == 'undefined') {
	if (console && console.log) { console.log('Keyboard Focus plugin could not be initialised because jQuery is not available'); }
} else { /* Start if jQuery exists */

jQuery.keyFocus = {};
jQuery.keyFocus.conf = {
	keyFocusClass : 'keyboard-focus',
	mouseFocusClass : 'mouse-focus',
	focusClass : 'focus',
	mouseTimeout  : 50
};

(function($){ /* start closure (protects variables from global scope) */
	
	$(document).ready(function(){
		$('body').trackFocus();
	});
	
	/**
	 * @see http://www.w3.org/TR/wai-aria-practices/#kbd_generalnav
	 * @param DOMNode this The container element that acts as "toolbar" for the controls.
	 * @param jQuerySelector controlSelector Individual controls to navigate between.
	 * @param Object options A set of options to override the $.AKN.defaultOptions. 
	 */
	$.fn.trackFocus = function () {
		$(this).data('last-device-used', '');
		
		$(this)
			.bind('mousedown', function(e){
				$(this).data('last-device-used', 'mouse');
				$(this).data('last-device-used-when', new Date().getTime());
			})
			.bind('keydown', function(e){
				$(this).data('last-device-used', 'keyboard');
			})
			.bind('focusin', function(e){
				// Keyboard events sometimes go undetected (if tabbing in from outside the document,
				// but mouse clicks used to focus will always be closely
				// followed by the focus event. Clearing the last-device-used
				// after a short timeout and assuming keyboard when no device is known
				// works!
					if ($(this).data('last-device-used') != 'mouse' || new Date().getTime()-50 > $(this).data('last-device-used-when')) {
						$(e.target).addClass($.keyFocus.conf.keyFocusClass);
					} else {
						$(e.target).addClass($.keyFocus.conf.mouseFocusClass);
					}
					$(e.target).addClass($.keyFocus.conf.focusClass);
			})
			.bind('focusout', function(e){
				$('.'+$.keyFocus.conf.keyFocusClass+', .'+$.keyFocus.conf.mouseFocusClass).removeClass($.keyFocus.conf.keyFocusClass+' '+$.keyFocus.conf.mouseFocusClass);
				$(e.target).removeClass($.keyFocus.conf.focusClass);
			})
		;
	};
		
	
	
})(jQuery); /* end closure */
} /* end if jQuery exists */