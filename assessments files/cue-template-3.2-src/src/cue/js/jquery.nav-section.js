/**
 * nav-section
 * manages section navigation for the Queensland Government Consistent User Experience
 * 
 * adds +/- expand controls to section navigation (unordered list)
 * toggles visibility of sub menus onclick or keyboard access
 * 
 * @version 1.1
 * @changelog
 *    * 0.1: Initial implementation.
 *    * 0.2: implemented "visually hidden text" for screen readers
 *    * 0.3: implemented icons for toggle
 *    * 0.4: initialise open submenus (must contain a link matching #content h1)
 *    * 0.5: commented code for future maintenance
 *    * 0.6: switched from image replacement to img with @alt
 *    * 0.7: fixing javascript error in IE6
 *    * 0.8: allow 'currentPageTitle' to specify which menu to open onload
 *    * 0.9: integrate keyboard access
 *    * 1.0: ignore modifier keys when handling keypress events
 *    * 1.1: new icons
 *    * 1.2: fix alt text (Closed should be Open); now expands current page when it is the parent item
 *
 * @requires jquery
 * @requires jquery.aria.js
 * @requires jquery.aria.key-nav.js
 */


// jquery closure, ensures all code is not executued unless 'jQuery' is defined
;if(typeof(jQuery)!="undefined") {
// run within this anonymous function
// expects jQuery to be passed in as '$' argument
(function($){


	// activate the navigation widget (used for keyboard support)
	// ref: http://www.w3.org/TR/wai-aria-practices/#treeview1
	var toggleSectionNavNode = function (evt) {
		if ($(evt.target).is('.qg-cue-widget-container > a')) {
			if ((evt.keyCode == DOM_VK_LEFT && $(evt.target).find('img').attr('alt') == '[-]')
			 || (evt.keyCode == DOM_VK_RIGHT && $(evt.target).find('img').attr('alt') == '[+]')) {
				$(evt.target).parent().find('.qg-cue-widget').trigger('click');
			}
		}
	};
	
	
	// define keyboard handling
	// ref: http://www.w3.org/TR/2000/WD-DOM-Level-3-Events-20000901/events.html#Level-3-Events-KeyEvents-Interfaces-h3
	var keyHandlers = {};
	keyHandlers[DOM_VK_LEFT] = keyHandlers[DOM_VK_RIGHT] = toggleSectionNavNode;


	// find the section navigation container
	$('#nav-section')

		// observe all click events inside #nav-section
		.click(function(evt) {

			// get the closest (self or ancestor) A element where the click occurred
			var target = $(evt.target).closest('a');

			// reduce the link text to a single +/- character (or empty string)
			// expects img@alt text (empty string otherwise)
			var action = (target.find('img').attr('alt') || '').replace(/^.*\[([+-])\].*$/, "$1");
			switch (action) {
				
				// if the link was '+' then open submenu
				case '+':
					// start traversal from the link containing '+'
					target
						// find submenu, i.e. UL sibling(s)
						.nextAll('ul')
							// stop any current (show/hide) animations
							.stop(true, true)
							// show submenu
							.show()
							// traverse back to target (link with '+' control)
							.end()
						// change the link contents to a '-' control
						.html('<img src="/Templates/cue/images/minus-flat.png" alt="[-]" /><span class="title">Close the ' + target.next().text() + ' submenu</span>')
					;
					// cancel default 'click' behaviour
					return false;
				
				// if the link was '-' then close submenu
				case '-':
					// start traversal from the link containing '-'
					target
						// find submenu, i.e. UL sibling(s)
						.nextAll('ul')
							// stop any current (show/hide) animations
							.stop(true, true)
							// hide submenu
							.hide()
							// traverse back to target (link with '-' control)
							.end()
						// change the link contents to a '+' control
						.html('<img src="/Templates/cue/images/plus-flat.png" alt="[+]" /><span class="title">Open the ' + target.next().text() + ' submenu</span>')
					;
					// cancel default 'click' behaviour
					return false;
					
				// for all other links (not +/- controls) in #nav-section, perform no action
			}
		})
		// end click handling
		
		// observe keypresses inside #nav-section
		// http://www.w3.org/TR/wai-aria-practices/#treeview1
		.keypress(function(evt) {
		
			// if modifier keys are down, ignore key presses
			if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) {
				// facilitate further bubbling
				return true;
			}
	
			switch (evt.charCode) {
				// '*' (numpad) expands all closed menus
				case 42:
					// find all [+] controls, and click them
					$('#nav-section img[alt="[+]"]').closest('a').trigger('click');
					// cancel default 'keypress' behaviour
					return false;
			}
			
			// a-z, jump to the next link starting with that prefix
			var prefix = String.fromCharCode(evt.charCode).toUpperCase();
			if (prefix.match(/[A-Z]/)) {
				// start from event target
				$(evt.target)
					// get all following siblings
					.nextAll()
						// and following siblings of all parents (within nav-section)
						.add($(evt.target).parentsUntil('#nav-section').nextAll())
							// find all the (visible) links in them
							.find('a:visible')
								// filter (only those beginning with 'prefix')
								.filter(function() {
									return $(this).text().charAt(0).toUpperCase() == prefix;
								})
									// take the first one
									.eq(0)
										// focus on it
										.focus()
				;
				// further bubbling is allowed (NOT cancelled by return false)
			}
			
			// facilitate further bubbling
			return true;
		})
		// end keypress handling

		// manage focus, ARIA keyboard handling
		// ref: http://www.w3.org/TR/wai-aria-practices/#treeview1
		.managefocus('a', {
			role  : 'menu',
			ignoreKeys  : [DOM_VK_LEFT, DOM_VK_RIGHT],
			keyHandlers : keyHandlers
		})
		// end manage focus
	;




	// add +/- controls to the menu (so the above click handling does something)

	// is the currentPageTitle defined?
	if (typeof(currentPageTitle) == "undefined") {
		// get the main H1 as the current page "identifier"
		currentPageTitle = $('#content h1').text();
	}
	// find all links within the #nav-section menu
	$('#nav-section ul a')
		// filter so only links with text matching the main H1 remain in this jquery object
		.filter(function() { return $(this).text() == currentPageTitle; })
			// traverse to all ancestors (li) elements
			// these contain the submenus (possibly multiple levels of nesting)
			.parents('li')
				// add a class so we know we have setup this menu (used in CSS too)
				.addClass('qg-cue-widget-container')
				// for each li in the jquery object
				.each(function() {
					var li = $(this);
					// add a '-' control, using the link text in the 'title'
					li.prepend('<a href="#nav-section" class="qg-cue-widget"><img src="/Templates/cue/images/minus-flat.png" alt="[-]" /><span class="title">Close the ' + li.children('a').text() + ' submenu</span></a>')
				})
	;
	// all the initially open menus are now setup with a '-' control to close them

	// find all submenus that are not open (already setup)
	$('#nav-section li:not(.qg-cue-widget-container) ul')
		// traverse to the parent (li) element
		// this is the li element that contains the submenu (ul)
		.parent()
			// add the class so we know we have setup this menu (used in CSS too)
			.addClass('qg-cue-widget-container')
			// for each li in the jquery object
			.each(function() {
				var li = $(this);
				// add a '+' control, using the link text in the 'title'
				li.prepend('<a href="#nav-section" class="qg-cue-widget"><img src="/Templates/cue/images/plus-flat.png" alt="[+]" /><span class="title">Open the ' + li.children('a').text() + ' submenu</span></a>');
			})
			// traverse back to the initial 'ul' submenu
			.end()
		// hide the submenu
		.hide()
	;
	// all the initially closed menus are now hidden with a '+' control to open them


// end jquery closure
})(jQuery); // pass 'jQuery' in as argument to anonymous function
} // end "if jquery"
