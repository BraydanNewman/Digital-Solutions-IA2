/**
 * This file expands the URL of content links and adds them to the page after the link.
 * These URLs are then hidden for display on screen, but are revealed using CSS
 * for printing.
 * 
 * @requires jQuery
 */
if (typeof jQuery != 'undefined') { /* Start if jQuery exists */
	
	/**
	 * printLinkURLs plugin
	 * Pre condition:  Page has been loaded, and contains a content section
	 * Post condition:  Links inside the content section (excluding breadcrumbs) have their full url text added inside a span with a class of "printOnly"
	 * Exceptions:  If a url exceeds the max allowable number of characters, the function will try to list only the domain of the link (http://whatever.qld.gov.au/...).  
	 * 		If the url is relative, no link will be added for long link lengths.
	 *		If the link is a target on the same page, then don't print it's url.
	 */
	$.fn.printLinkURLs = function () {
		
		printLinkMaxURLLength = printLinkMaxURLLength || 200;
		
		$(this).filter('a').each(function() {
			
			// Grab the href value from "this" 'a' element.
			// a.href returns an absolute path.
			linkHref = this.href;
			
			// Test for max length of the URL
			if (linkHref.length > printLinkMaxURLLength) {
				// URL is too long! Use the domain name with an ellipses instead
				linkHref = this.protocol+'//'+this.hostname;
			}
			
			// Append the URL to the 'a' element with a span so it can be hidden
			$(this).after('<small class="print-link-url"> ( '+linkHref+' )</small>');
			
		});
	}
} /* end if jQuery exists */