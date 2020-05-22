/**
 * jquery.transformer-layout.js
 * (including code from jquery.mediaqueries.js 1.1.4 <http://plugins.jquery.com/project/MediaQueries>)
 * 
 * @author Andrew Ramsden <http://irama.org/>
 * @author Alexander Farkas
 * 
 * @version 3.1
 * @see http://irama.org/web/dhtml/transformer/
 * @license GNU GENERAL PUBLIC LICENSE (GPL) <http://www.gnu.org/licenses/gpl.html>
 * @license MIT LICENSE <http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt>
 * 
 * @requires jQuery (tested with 1.4.2) <http://jquery.com/>
 * @requires jQuery resize events plugin <http://irama.org/web/dhtml/resize-events/>
 * @requires Optional: pxToEm (required to support em values in media queries) <http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/>
 *
 * @changelog
 *   * 3.1: Different approach to styleswitching so as to maintian order of stylesheet includes in head. 
 *          Fixed bug in IE6 at low resolution. Added support for optional layout classes on body (handy for IE tweaks).
 *   * 3.1.1: Tweaked to initialise ResizeEvents ASAP (avoids flicker in IE6 on longer pages)
 */

(function($) { /* start closure */
	/**
	 * Initialise transformer (media query support for all browsers)
	 */
	$.transformer = function (options) {
		
		options = jQuery.extend({
			addClasses : false
		}, options);
		$('body').data('transformer-layout-options',options);
		
		// test for media query support
		
			if ($.support.mediaQueries()) {
				
				if ($.browser.webkit && ResizeEvents) {
					// Webkit supports doesn't trigger new stylesheet on zoom
						ResizeEvents.bind('x-window-width-resize x-text-resize', zoomEventSupplement);
				}
				
				// Otherwise media queries are fully supported (FF & Opera). No need to supplement.
					if (options.addClasses) {
						initMediaQuerySupplement();
						ResizeEvents.bind('x-initial-sizes x-text-resize x-window-width-resize', updateBodyClasses);
					}
				
				
			} else if (ResizeEvents) {
				// media queries are not supported. Fully supplement (requires ResizeEvents plugin)
					initMediaQuerySupplement();
					ResizeEvents.bind('x-initial-sizes x-text-resize x-window-width-resize', resizeEventSupplement);
					
			}
		
		// init ResizeEvents ASAP!
			ResizeEvents.initialise();
	}
	
	
	/**
	 * Triggered on window or text resize to supplement media query support 
	 * for browsers that require it.
	 * 
	 * @require jquery.pxToEm.js (if em units used)
	 */
	resizeEventSupplement = function () {
		
		// grab options
			options = $('body').data('transformer-layout-options');
			
		// disable old media query driven stylesheets
			$('.current-media-query-stylesheet').remove();
		
		// trigger recalculation based on existing styles
			$('head link').each(function(){
				$(this).attr('href', $(this).attr('href'));
			});
			
			
		// check if any media query based stylesheets are now relevant
			processEachStylesheet(addClasses = options.addClasses, addLinks = true);
	};
	
	/**
	 * If updateClassesForAll is sent as an options to $.transform() this function
	 * is called on text or window resize events to updated the body classes for all
	 * browsers.
	 */
	updateBodyClasses = function () {
		processEachStylesheet(addClasses = true, addLinks = false);
	};
	
	
	/**
	 * Loops through the parsed stylesheets to see which are still relevant
	 * @param addClasses Boolean Whether to set classes on the body element or not.
	 * @param addLinks Boolean Whether to add link elements to the head (required 
	 *        for browsers that don't support media queries directly.
	 */
	processEachStylesheet = function (addClasses, addLinks) {
		// init optional args
			addClasses = addClasses||false;
			addLinks = addLinks||false;
		
		// grab current window width
			currentWindowWidth = $(window).width();
			
		// remove old layout classes
			if (addClasses) {
				$('body')
					.removeClass($('body').data('current-layout-names'))
					.data('current-layout-names', '')
				;
			}
		

		// check if any media query based stylesheets are now relevant
			for (var i = 0, len = $.transformer.styles.length; i < len; i++) {
								
				// If em value used, convert to px
					minPx = ($.transformer.styles[i].minUnit != 'em' || $.transformer.styles[i].min === 0)?$.transformer.styles[i].min:$.emToPx($.transformer.styles[i].min);
					maxPx = ($.transformer.styles[i].maxUnit != 'em' || $.transformer.styles[i].max === 0)?$.transformer.styles[i].max:$.emToPx($.transformer.styles[i].max);
				
				// pxToEm returns incorrect values for IE6 at low resolutions
					if ($.browser.msie && $.browser.version < 7 && $.transformer.styles[i].minUnit == 'em' && currentWindowWidth < 200) {
						// Hardcode minimum value to ensure the wrong stylesheet not loaded at low resoltuion
						minPx = (typeof minPx == 'undefined' || minPx === 0)? minPx: 200;
					}
				
				if (((!(minPx && minPx > currentWindowWidth) && !(maxPx && maxPx < currentWindowWidth)) || (!maxPx && !minPx))) {
					
					if (addLinks) {
						// enable relevant stylesheets
							currentLink = $($.transformer.styles[i].obj);
							currentLink.after('<link type="'+currentLink.attr('type')+'" rel="'+currentLink.attr('rel')+'" media="'+$.transformer.styles[i].medium+'" href="'+currentLink.attr('href')+'" class="current-media-query-stylesheet" />');
					}
					
					if (addClasses) {
						$('body')
							.addClass($.transformer.styles[i].layout)
							.data('current-layout-names', $('body').data('current-layout-names')+' '+$.transformer.styles[i].layout)
						;
					}
						
				}
			}
	};
	
	
	/**
	 * Converts an em value to a px value if pxToEm is available.
	 * @param emValue a value in em units to be converted
	 * @return The converted pixel value if pxToEm is available.
	 *         Otherwise returns the emValue unconverted.
	 */
	$.emToPx = function (emValue) {
		if (typeof Number.prototype.pxToEm == 'undefined') {
			if (console && console.log) {
				console.log('em value conversion failed. pxToEm could not be found. Returning em value unconverted.');
			}
			return emValue;
		}
		
		return parseInt(emValue.pxToEm({reverse: true}),10);
	};
	
	/**
	 * Initialise the full supplement for browsers that don't support
	 * media queries.
	 */
	initMediaQuerySupplement = function() {
		// store info about all stylesheets
			$.transformer.styles = [];
			
		// parse all linked stylesheets
			$('link[rel*=style],style').each(parseStylesheets);
	};
	
	/**
	 * Parse relevant information from the link elements.
	 * Send a link or style DOMnode as 'this'.
	 */
	parseStylesheets = function () {
		
		var 
			medias = $(this).attr('media'), 
			pMin = /\(\s*min-width\s*:\s*(\d+)(px|em)\s*\)/, 
			pMax = /\(\s*max-width\s*:\s*(\d+)(px|em)\s*\)/, 
			resMin, resMinValue, resMinUnit,
			resMax, resMaxValue, resMaxUnit,
			supportedMedia = ['handheld', 'all', 'screen', 'projection', 'tty', 'tv', 'print'], 
			curMedia, 
			mediaString = [];
			medias = (!medias) ? ['all'] : medias.split(',')
		;
		// layoutname = filename - .css
			layoutname = parseLayoutNameFromPath($(this).attr('href'));
			
		// Store original media attribute for switching in later
		$(this).data('media', $(this).attr('media'));
		
		for (var i = 0, len = medias.length; i < len; i++) {
			curMedia = $.arrayInString(medias[i], supportedMedia)
			if (curMedia != -1) {
				if (!resMin) {
					resMin = pMin.exec(medias[i]);
					if (resMin) {
						resMinValue = parseInt(resMin[1], 10);
						resMinUnit = resMin[2];
					}
				}
				if (!resMax) {
					resMax = pMax.exec(medias[i]);
					if (resMax) {
						resMaxValue = parseInt(resMax[1], 10);
						resMaxUnit = resMax[2];
					}
				}
				mediaString.push(supportedMedia[curMedia]);
			}
		}
		
		if (resMin || resMax) {
			$.transformer.styles.push({
				obj     : this,
				layout  : layoutname,
				min     : resMinValue,
				minUnit : resMinUnit,
				max     : resMaxValue,
				maxUnit : resMaxUnit,
				medium  : mediaString.join(',')
			});
		}
	};
	
	/**
	 * Takes a file path like 'css/layout-large.css' and returns the 
	 * layout name 'layout-large'.
	 * @param path A string pathname

	 * @return The string of the filename without the extension.
	 */
	parseLayoutNameFromPath = function (path) {
		if ((slashIndex = path.lastIndexOf('/')) != -1) {
			path = path.substring(slashIndex+1);
		}
		return path.replace('.css','');
	};
	
	/**
	 * Triggered on text resize to supplement media query support for (currently webkit) browsers 
	 * that don't recalculate media queries on zoom.
	 */
	zoomEventSupplement = function () {
		// Once text size changed, force recalculation of media query
			triggerRecalc = $('<style type="text/css">');
			$('head')
				.prepend(triggerRecalc)
				.remove(triggerRecalc)
			;
	};
	
	/**
	 * Test to see if a string exists within an array.
	 * 
	 * @param str The string to search for.
	 * @param arr The array to search within.
	 * @return The index of the array the string was found in or -1 if string was not found.
	 */
	$.arrayInString = function(str, arr){
        var ret = -1;
        $.each(arr, function(i, item){
			if (str.indexOf(item) != -1) {
                ret = i;
                return false;
            }
        });
        return ret;
    };
	
	/**
	 * Add media query support detection to jQuery.support
	 * Test using: if ($.support.mediaQueries())
	 */
	$.extend($.support, {
		mediaQueries : function() {
			
			// Add test div
				$('body').append($('<div id="jquery-test-media-query">').css({visibility: 'hidden', position: 'absolute'}));
			
			// Add stylesheet with media query
				$('head').prepend('<style type="text/css" media="only all" id="jquery-test-media-query-style">');
			
			// add rule to new stylesheet
				styleS = document.styleSheets[0];
				if (styleS.cssRules || styleS.rules) {
					if (styleS.insertRule) {
						styleS.insertRule('#jquery-test-media-query {display:none !important;}', styleS.cssRules.length);
					} else if (styleS.addRule) {
						styleS.addRule('#jquery-test-media-query', 'display:none');
					}
				}
			
			// test support
				querySupported = $('#jquery-test-media-query').css('display') === 'none';
			
			// clean up
				$('#jquery-test-media-query, #jquery-test-media-query-style').remove();
			
			// return
				return querySupported;
		}
	});
	
	
})(jQuery); /* end closure */