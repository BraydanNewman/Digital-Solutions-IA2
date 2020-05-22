/**
 * jquery.aria-key-nav.js (ARIA keyboard navigation made easy)
 * 
 * @version 0.93
 * Changelog:
 *   * 0.5 Improved handling of ARIA roles.
 *   * 0.6 Added bail clause for browsers that don't support ARIA.
 *   * 0.7 Added option to not remember the last focused control within a controlset (when you tab away and back to a controlset).
 *   * 0.8 Refactored and added support for browsers that haven't implemented ARIA activedescendant property.
 *   * 0.9 Now accounts for focus being changed by external scripts or shifted away from a controlset other than by the keyboard.
 *   * 0.91 Now supports managing focus when some items are not visible.
 *   * 0.92 Ignore keypresses when Windows/Cmd keys are down (i.e: event.metaKey).
 *   * 0.93 If focus is set on controlset, shift focus to relevant descendant control.
 * 
 * @author Andrew Ramsden
 * @see http://irama.org/web/dhtml/aria/key-nav/
 * @license Common Public License Version 1.0 <http://www.opensource.org/licenses/cpl1.0.txt>
 * @requires jQuery (tested with version 1.3.1) <http://jquery.com/>
 * @requires jQuery jARIA plugin <http://outstandingelephant.com/jaria/>
 * @tested FF 3.6.3, Chrome 4, Safari 4, Opera 10.51, IE 6, 7 and 8.
 */


// CONSTANTS
	DOM_VK_END    = 35;
	DOM_VK_HOME   = 36;
	DOM_VK_LEFT   = 37;
	DOM_VK_UP     = 38;
	DOM_VK_RIGHT  = 39;
	DOM_VK_DOWN   = 40;
	DOM_VK_ENTER  = 14;
	DOM_VK_RETURN = 13; // ???
	DOM_VK_ESCAPE = 27;
	jQuery.AKN = {
		DIRECTION_PREV  : 0,
		DIRECTION_NEXT  : 1,
		DIRECTION_FIRST : 2,
		DIRECTION_LAST  : 3,
		ORDER_NORMAL    : 1,
		ORDER_REVERSE   : 0
	};

/**
 * Default options, these can be overridden for each call to managefocus.
 */
jQuery.AKN.defaultOptions = {
	controlOrder          : jQuery.AKN.ORDER_NORMAL,
	rememberActiveControl : true, // remember the active control when you tab away and return
	ignoreKeys            : [], // Don't ignore any arrow keys by default. Example, to ignore left and right: [37,39]
	keyHandlers           : {}, // Don't add extra handlers by default. Example, to add separate handlers for left and right: {37:handleLeftKeyEvent,39:handleRightKeyEvent}
	role                  : 'toolbar',
	controlRole           : 'button'
};

/**
 * Global configuration (these apply to every instance of controlset, etc...)
 * Adjust to suit your preferred markup here, these can't be overriden for each instance.
 */
jQuery.AKN.conf = {
	controlsetClass      : 'controlset',
	regionClass          : 'region',
	controlClass         : 'control',
	ariaFocusClass       : 'aria-focus' // given to the 'activedescendant' element so it can be styled (this is a requirement of ARIA best practice)
};
// start closure (protects variables from global scope)
(function($){
	
	// init
		regionCount = 0;
		controlCount = 0;
	
	
	/**
	 * Sets up keyboard navigation for a set of controls as per ARIA best practice.
	 * Treats the specified element as a control set and the descendant controls 
	 * selected by the first argument are then accessible via arrow keys.
	 * @see http://www.w3.org/TR/wai-aria-practices/#kbd_generalnav
	 * 
	 * Focus is managaed with tabindex alone so that all browsers are supported.
	 * @see http://www.w3.org/WAI/PF/aria-practices/#visualfocus
	 * 
	 * @param DOMNode this The container element that acts as "toolbar" for the controls.
	 * @param jQuerySelector controlSelector Individual controls to navigate between.
	 * @param Object options A set of options to override the $.AKN.defaultOptions. 
	 */
	$.fn.managefocus = function (controlSelector, /* optional */ options) {
		
		if (typeof options == 'undefined') {
			options = {};
		}
		
		// Was a role sent for the controls? (controlRole)
			if (typeof options.controlRole == 'undefined' || options.controlRole == '') {
				// If not, try to guess an applicable role for the controls in the set (default '')
					switch ($.trim(options.role)) {
						case 'menubar':
						case 'toolbar':
							options.controlRole = 'button';
						break;
						case 'tablist':
							options.controlRole = 'tab';
						break;
						case 'menu':
							options.controlRole = 'menuitem';
						break;
						default:
							// don't set it, let the defaultOption come through
						break;
					}
			}
		
		// Merge runtime options with defaults
		// Note: The first argument sent to extend is an empty object to
		// prevent extend from overriding the default $.AKN.defaultOptions object.
			options = (typeof options == 'undefined')
				? $.AKN.defaultOptions
				: $.extend({}, $.AKN.defaultOptions, options)
			;
		
		
		$(this)
			.addClass($.AKN.conf.controlsetClass)
			.data('controlSelector', controlSelector)
			.data('options', options)
			.each(initManageFocus)
		;
		
		return $(this); /* facilitate chaining */
	};
	
	initManageFocus = function () {
		controlSelector = $(this).data('controlSelector');
		options = $(this).data('options');
		
		// Ensure each controlset has a unique id
			if ($(this).attr('id') == '') {
				$(this).attr('id', 'controlset-'+regionCount++);
			}
		
		// if no role set on container, set it based on supplied option or default
			if (typeof $(this).ariaRole() == 'undefined') {
				$(this).ariaRole(options.role);
			}
			$(this).attr('tabindex', -1);
			
		// Ensure each control is removed from tab order
		// Ensure all controls have a unique id
		// Add click handler to force focus event for non-aria UAs
			$(this).find(controlSelector)
				.each(function(){
					// if not id set, assign a unique id
						if ($(this).attr('id') == '') {
							controlCount++;
							$(this).attr('id', $.AKN.conf.controlClass+'-'+controlCount);
						}
					// if no role set on controls, set it based on supplied option or default
						if (typeof $(this).ariaRole() == 'undefined') {
							$(this).ariaRole(options.controlRole);
						}
						
						$(this)
							.attr('tabindex', -1)
							.addClass($.AKN.conf.controlClass)
						;
				})
			;
			
		// Determine the first element that would get focus
		// $.AKN.ORDER_REVERSE allows controls to be floated 'right', yet still controlled in the expected visual order.
			if (options.controlOrder == $.AKN.ORDER_NORMAL) {
				defaultControl = $(this).find(controlSelector+':first');
			} else {
				defaultControl = $(this).find(controlSelector+':last');
			}
			defaultControl.attr('tabindex', 0);
			
		
		// Capture key events
			$(this)
				.bind('keydown', handleKeyDownEvent)
				.bind('focusin', handleFocusInEvent)
			;
		
	};
	
	handleKeyDownEvent = function (evt) {
		
		// init
			currentControl = $(evt.target);
			evtKeyCode = getKeyCode(evt);
			
		// If modifier keys are down, ignore key presses
			if (
				evt.ctrlKey ||
				evt.altKey ||
				evt.shiftKey ||
				evt.metaKey
			) {
				return true; /* facilitate further bubbling */
			}
		
		// init
			containerEl = currentControl.closest('.'+$.AKN.conf.controlsetClass);
			options = containerEl.data('options');
		
		// Process list of keys to ignore
			if ($.inArray(evtKeyCode, options.ignoreKeys) != -1) {
				// Process key handlers anyway
					processKeyHandlers(containerEl, options.keyHandlers, evt);
				return true; /* facilitate further bubbling */
			}
		
		// Not an ignored keycode, handle it here
			switch (evtKeyCode) {
				default:
					// A different (untracked) key was pressed, just ignore it
						return true; /* facilitate further bubbling */
				break;
				case DOM_VK_UP:
				case DOM_VK_LEFT:
					direction = (options.controlOrder == $.AKN.ORDER_NORMAL) ? $.AKN.DIRECTION_PREV : $.AKN.DIRECTION_NEXT ;
				break;
				case DOM_VK_DOWN:
				case DOM_VK_RIGHT:
					direction = (options.controlOrder == $.AKN.ORDER_NORMAL) ? $.AKN.DIRECTION_NEXT : $.AKN.DIRECTION_PREV ;
				break;
				case DOM_VK_HOME:
					direction = (options.controlOrder == $.AKN.ORDER_NORMAL) ? $.AKN.DIRECTION_FIRST : $.AKN.DIRECTION_LAST ;
				break;
				case DOM_VK_END:
					direction = (options.controlOrder == $.AKN.ORDER_NORMAL) ? $.AKN.DIRECTION_LAST : $.AKN.DIRECTION_FIRST ;
				break;
			}
		
		// arrow keys and home/end will scroll window, we don't want that (prevent default action)
			evt.preventDefault(); // Doesn't prevent scroll in Opera (10.00 and 10.53 tested)
		
		currentControl.focusNextControl(direction);
		
	};
	
	
	/**
	 * If key handlers have been specified for this control, call them now.
	 */
	processKeyHandlers = function (containerEl, keyHandlers, evt) {
		evtKeyCode = getKeyCode(evt);
		if (evtKeyCode in keyHandlers) {
			for (keyCode in keyHandlers) {
				if (keyCode == evtKeyCode) {
					// Send through the controlset element as 'this'
					// Send through the evt object so that evt.target can also be used
						keyHandlers[keyCode].apply(containerEl.get(0), [evt]);
				}
			}
		}
	};
	
	
	/**
	 * In case focus is initiated elsewhere, ensure this is the only
	 * focused element.
	 */
	handleFocusInEvent = function (evt) {
		
		focused = $(evt.target);
		containerEl = $(this);
		
		// if the container element was focused, shift focus to relevant descendant control
			if (containerEl.attr('id') == focused.attr('id')) {
				// set focus to previously focused element
				containerEl.find('*[tabindex=0]').first().focus();
				return;
			}
		
		allControls = containerEl.find(containerEl.data('controlSelector'));
		
		allControls.not(focused).attr('tabindex', -1);
		focused.attr('tabindex', 0);
		
		
		if ($('body').data('akn-last-focused-controlset') != $(this).attr('id')) {
			
			// update last focused controlset
				$('body').data('akn-last-focused-controlset', $(this).attr('id'));
			
			// focus has entered the controlset, ensure focus is on appropriate control
				options = containerEl.data('options');
				
				if (options.rememberActiveControl) {
					// last focused control still has tabindex="0", just return
						return;
				} else {
					
					direction = (options.controlOrder == $.AKN.ORDER_NORMAL) ? $.AKN.DIRECTION_FIRST : $.AKN.DIRECTION_LAST ;
					firstControl = $(focused).findNextControl(direction);
					// if next is the same as current, do nothing, just return
						if (focused.attr('id') == firstControl.attr('id')) {
							return;
						}
					
					// prevent the default focus action from occurring.
						evt.preventDefault();
					// Shift focus to where it should be
						focused.shiftFocus(firstControl);
				}
		}
		
	};
	
	/**
	 * Set focus on next control using "roving tabindex"
	 * @see http://www.w3.org/WAI/PF/aria-practices/#kbd_general_within
	 * 
	 * @this the current control
	 * @param direction The direction to move (next, prev, first or last)
	 */
	$.fn.focusNextControl = function (direction) {
		return $(this).shiftFocus($(this).findNextControl(direction)); // faciliate chaining
	};
	
	$.fn.findNextControl = function (direction) {
		
		// find next control
			containerEl = $(this).closest('.'+$.AKN.conf.controlsetClass);
			
			allControls = containerEl.find(containerEl.data('controlSelector')).filter(':visible');
			currentControlIndex = allControls.index($(this));
			
			// find next element
				switch (direction) {
					default:
					case $.AKN.DIRECTION_NEXT:
						// navigation is circular, if there are no more elements on the end, wrap to the start
							return (currentControlIndex+1 < allControls.size())?allControls.eq(currentControlIndex+1):allControls.eq(0);
					break;
					case $.AKN.DIRECTION_PREV:
						// navigation is circular, if there are no more elements before, wrap to the last element
							return (currentControlIndex-1 >= 0)?allControls.eq(currentControlIndex-1):allControls.eq(allControls.size()-1);
					break;
					case $.AKN.DIRECTION_FIRST:
						// jump straight to the first item
							return allControls.eq(0);
					break;
					case $.AKN.DIRECTION_LAST:
						// jump straight to the last item
							return allControls.eq(allControls.size()-1);
					break;
				}
	};
	
	$.fn.shiftFocus = function (toBeFocused) {
		// if next is the same as current, do nothing, just return
			if ($(this).attr('id') == toBeFocused.attr('id')) {
				return $(this); // faciliate chaining
			}
			
		// set focus
			toBeFocused
				.attr('tabindex', 0)
				.focus()
			;
		
		// remove previous control from tab order
			$(this).attr('tabindex', -1);
		
		return $(this); // faciliate chaining
	};
	
	/**
	 * Establishes a relationship between a controlset and the page regions controlled by the controlset.
	 * As per ARIA controls property.
	 * @see http://www.w3.org/TR/wai-aria/#controls
	 */
	$.fn.controls = function (regionControlledSelector) {
		
		$(this).each(function() {
			elementList = '';
			
			// for each element matched (controlled) add to controls property
				$(regionControlledSelector).each(function(){
					if ($(this).attr('id') == '') {
						regionCount++;
						$(this).attr('id', $.AKN.conf.regionClass+'-'+regionCount);
					}
					
					elementList += ' '+$(this).attr('id');
				});
				
				if (elementList != '') {
					$(this)
						.addClass($.AKN.conf.regionClass)
						.ariaState('controls', $.trim(elementList))
					;
				}
		});
		
		return $(this); /* facilitate chaining */
	};
	
	/**
	 * Establishes a relationship between a controlset and a parent region controlled by the controlset.
	 * As per ARIA controls property.
	 * @see http://www.w3.org/TR/wai-aria/#controls
	 */
	$.fn.controlsParent = function (parentRegionSelector) {
		$(this).each(function() {
			$(this).controls($(this).closest(parentRegionSelector));
		});
		
		return $(this); /* facilitate chaining */
	};
	
	/**
	 * Get the keycode of an event
	 */
	function getKeyCode(evt) {
		evt = evt || window.event;
		
		if (evt.keyCode) {
			return evt.keyCode;
		} else if (evt.which) {
			return evt.which;
		}
		return null;
	}

	
})(jQuery); /* end closure */