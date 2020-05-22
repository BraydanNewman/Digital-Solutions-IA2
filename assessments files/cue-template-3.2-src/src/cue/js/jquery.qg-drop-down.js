/**
 * qg-drop-down
 * A jQuery plugin for adding drop-down menu functionality.
 * 
 * Currently used for site navigation and page options menus.
 * Note: This plugin only supports up to one level of drop-downs as this is
 *       a restriction of the CUE template.
 * 
 * @version 0.8
 * @changelog
 *    * 0.1: Initial implementation.
 *    * 0.2: Refactored into jQuery plugin so can be applied to more than one menu.
 *    * 0.3: Class 'open' now not applied to top level item without children. Updated which menus to initialise
 *    * 0.4: Added full keyboard navigation support for all browsers
 *    * 0.5: Changed algorithm to find if menu should open left or right (now checks for space within container, not full page)
 *    * 0.6: Updated key handlers code to use constants rather than hardcoded 'magic numbers'
 *    * 0.7: Ensure that each child menu is at least 20 pixels wider than the parent menu item
 *    * 0.8: Can now find the top level menu list even if not a direct child of the node passed to the plugin
 *           (i.e: now checks for first list within all descendents). Also added detailed code comments.
 * 
 * @requires jquery
 * @requires jquery.aria.js
 * @requires jquery.aria.key-nav.js
 */
 
if (typeof jQuery != 'undefined') { /* Start if jQuery exists */

(function($) { /* start closure */
	
	/**
	 * The jQuery "plugin" that can be applied to any nested list of
	 * links to turn it into a qgDropDown menu.
	 * 
	 * Example: $('#nav-site').qgDropDown();
	 */
	$.fn.qgDropDown = function () {
		// Initialise each element in the nodeset passed to the plugin.
			$(this).each(initDropDown);	
	};
	
	
	/**
	 * Initialisation (for internal use by qgDropDown plugin above)
	 * Add event handlers, initialise timeoutID
	 */
	initDropDown = function () {
		
		// Find the top level menu list
			toplist = $(this).is('ul, ol')?$(this):$(this).find('ul, ol').first();
		
		// If not found, output a debug message
			if (toplist.size() == 0) {
				console && console.log && console.log('Debug: Unable to initialise qgDropDown menu, no list was found within the target element '+$(this).selector);
				return;
			}
		
		// keyHandlers for drop down
			keyHandlers = {};
			keyHandlers[DOM_VK_LEFT] = handleLeftKeyEvent;
			keyHandlers[DOM_VK_RIGHT] = handleRightKeyEvent;
			keyHandlers[DOM_VK_ESCAPE] = handleEscKeyEvent;
		
		// Initialise states and event listeners for menu list
			toplist
				.data('timeoutID', null)
				.addClass('qg-drop-down') // add a class so we can identify the top level menu list
				.children('li')
					.bind('mouseenter focus focusin', openCurrentMenu) // IE 6,7,8 require 'focus' (other browsers 'focusin')
					.bind('mouseleave blur focusout', closeCurrentMenu) // IE 6,7,8 require 'blur' (other browsers 'focusout')
					.managefocus ( // manage focus of links within as per ARIA best practice
						'a:not(ul ul ul a)',
						{
							role  : 'menu',
							ignoreKeys  : [DOM_VK_LEFT, DOM_VK_RIGHT, DOM_VK_ESCAPE],
							keyHandlers : keyHandlers,
							rememberActiveControl : false
						}
				
					)
					.each(function(){
						// Flag if this top level menu item contains a child menu or not.
						// Can be used for CSS styling.
							if ($(this).find('ul').size() > 0) {
								$(this).addClass('parent');
							} else {
								$(this).addClass('single');
							}
						
						// Ensure that each child menu is at least 20 pixels wider than the parent menu item
							indent = 20;
							parentWidth = $(this).children('a').first().outerWidth(true);
							childWidth = $(this).children('ul').first().width();
							if (parentWidth > childWidth) {
								$(this).children('ul').first().width(parentWidth+indent);
							}
						
					})
			;
	};
	
	/**
	 * Open the currently hovered/focused menu.
	 */
	openCurrentMenu = function(evt){
		
		// Find the qgDropDown menu
			toplist = $(this).closest('.qg-drop-down');
		
		// Clear any menu timeouts so menus don't close after this new menu
		// is opened.
			if ((timeoutID = toplist.data('timeoutID')) != null) {
				window.clearTimeout(timeoutID);
				toplist.data('timeoutID', null);
			}
		
		// Close any menus that are still open
			closeAllOpenMenus();
		
		// Flag the currently open parnet item so it can be styled using CSS
			currentLI = $(this).closest('.qg-drop-down > li');
			currentLI
				.addClass('hover')
				.css('z-index', 2) // for IE 6 and 7
			;
		
		// Open the child menu
			childMenu = currentLI.children('ul').first();
			if (childMenu.size() > 0) {
				currentLI.children('a').removeClass('parent').addClass('open');
				
				// if the child menu is too wide to fit within the qgDropDown menu's
				// parent at it's current position, instruct it to display as a
				// .right-edge menu (CSS can flip it's display so it fits on screen).
					if (childMenu.offset().left + childMenu.outerWidth(true) >
						toplist.parent().offset().left + toplist.parent().width()) {
						childMenu.addClass('right-edge');
					}
			}
	};
	
	
	/**
	 * Close the menu that was just blurred/moused-out-of.
	 * Set a timeout (300ms) so the menu doesn't close immediately. This establishes a 
	 * tolerance for users who accidentally leave the menu and come back in quickly.
	 */
	closeCurrentMenu = function(){
		tid = window.setTimeout(closeAllOpenMenus, 300)
		$(this).closest('.qg-drop-down').data('timeoutID', tid);
	};
	
	
	/**
	 * Close all open menus.
	 */
	closeAllOpenMenus = function () {
		$('.qg-drop-down')
			.data('timeoutID', null)
			.find('li.hover')
				.css('z-index', 1) // for IE 6 and 7
				.add('ul')
				.add('a.open')
					.removeClass('hover open right-edge') // clean up open menu classes
		;
	};
	
	
	/**
	 * Handler for left arrow key when pressed within the menu.
	 * Move focus to the previous top level menu item, or if there are no previous items
	 * move to the last item (cyclical).
	 */
	handleLeftKeyEvent = function (evt) {
		
		toBeFocused = $(this).prev().children('a');
		if (toBeFocused.size() == 0) {
			toBeFocused = $(this).siblings().last().children('a');
		}
		
		toBeFocused
			.attr('tabindex', 0)
			.focus()
		;
	};
	
	
	/**
	 * Handler for right arrow key when pressed within the menu.
	 * Move focus to the next top level menu item, or if there are no more items
	 * move to the first item (cyclical).
	 */
	handleRightKeyEvent = function (evt) {
		
		toBeFocused = $(this).next().children('a');
		if (toBeFocused.size() == 0) {
			toBeFocused = $(this).siblings().first().children('a');
		}
		
		toBeFocused
			.attr('tabindex', 0)
			.focus()
		;
	};
	
	/**
	 * Handler for escape arrow key when pressed within the menu.
	 * Shift focus back to the top level menu item and close all open menus.
	 */
	handleEscKeyEvent = function (evt) {
		$(this).children('a')
			.attr('tabindex', 0)
			.focus()
		;
		closeAllOpenMenus();
	};

	
})(jQuery); /* end closure */
} /* end if jQuery exists */