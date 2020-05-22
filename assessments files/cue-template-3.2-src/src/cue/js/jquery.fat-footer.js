/**
 * This file contains keyboard navigation code for the fat footer.
 * Left and right arrow keys should take you between fat footer sections
 * (.section) and up and down arrows take you up and down the list within 
 * each section.
 * 
 * @requires jquery
 * @requires jquery.aria.js
 * @requires jquery.aria.key-nav.js
 */
if (typeof jQuery != 'undefined') { /* Start if jQuery exists */
(function($) { /* start closure */
	
	
	/**
	 * Handler for left arrow key when pressed within the fat footer.
	 * Move focus to the previous section, or if there are no previous sections
	 * move to the last section (cyclical).
	 */
	fatFooterLeftKeyEvent = function (evt) {
		
		toBeFocused = $(this).prev().find('a[tabindex=0]');
		if (toBeFocused.size() == 0) {
			toBeFocused = $(this).siblings('.section').last().find('a[tabindex=0]');
		}
		
		toBeFocused
			.attr('tabindex', 0)
			.focus()
		;
	};
	
	
	/**
	 * Handler for right arrow key when pressed within the fat footer.
	 * Move focus to the next section, or if there are no more sections
	 * move to the first section (cyclical).
	 */
	fatFooterRightKeyEvent = function (evt) {
		
		toBeFocused = $(this).next().find('a[tabindex=0]');
		if (toBeFocused.size() == 0) {
			toBeFocused = $(this).siblings('.section').first().find('a[tabindex=0]');
		}
		
		toBeFocused
			.attr('tabindex', 0)
			.focus()
		;
	};
	
	
	
	// Add ARIA keyboard navigation to fat footer
		ffooterKeyHandlers = {};
		ffooterKeyHandlers[DOM_VK_LEFT] = fatFooterLeftKeyEvent;
		ffooterKeyHandlers[DOM_VK_RIGHT] = fatFooterRightKeyEvent;
		$('#fat-footer .section').managefocus(
			'a', {
				role  : 'menu',
				ignoreKeys  : [DOM_VK_LEFT, DOM_VK_RIGHT],
				keyHandlers : ffooterKeyHandlers
			}
		);
	
})(jQuery); /* end closure */
} /* end if jQuery exists */