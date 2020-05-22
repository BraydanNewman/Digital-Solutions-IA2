/**
 * This file contains functions used to:
 *    * add "enhancement" pages options that rely on JavaScript
 *    * duplicate the top page options at the bottom
 *    * add a feedback page option (if a feedback form exists)
 * 
 * @requires jquery
 * @see jquery.qg-drop-downs.js for drop down functionality
 */
if (typeof jQuery != 'undefined') { /* Start if jQuery exists */
(function($) { /* start closure */
	
	/**
	 * Add 'Email' option.
	 * 
	 * If a 'Printable version' link exists in page options, don't add a print
	 * option. Otherwise, prepend a 'Print' link to page options.
	 * 
	 * Expand out 'Share' options (only if none are manually specified).
	 */
	$.enhancePageOptions = function () {
		
		// if no page options available, exit
			if ($('#pre-page-options, #post-page-options, #page-feedback').size() == 0) {
				return;
			}
		
		// Add JavaScript enhancements
			if ($('#pre-page-options').size() > 0) {
				addEmailOption();
				addPrintOption();
				populateShare();
			}
		
		// Duplicate page options from top to bottom
			if ($('#post-page-options').size() == 0) {
				postPageOptions = $('<div class="page-options" id="post-page-options"><ul></ul></div>');
				
				// Insert before page feedback (if it exists), otherwise insert after
				// the first of doc properties, the last aside, content or article.
					if ($('#page-feedback').size() > 0) {
						$('#page-feedback').before(postPageOptions);
					} else {
						$('#document-properties, .aside:last, #content, .article').first().after(postPageOptions);
					}
			}
			duplicateOptionsToPost();
		
		// Add feedback element option to #post-page-options
			addFeedbackOption();
	};
	
	/**
	 * Prepend an email link to page options
	 */
	addEmailOption = function () {
		$('#pre-page-options > ul').prepend('<li><a href="#email" id="share-by-email" title="Email this page to a friend">Email</a></li>');
		
		pageTitle = $('h1').first().text();
		pageURL = window.location+'';
		
		$('#share-by-email').attr('href',
			'mailto:?subject='+pageTitle+
			'&body='+pageTitle+' (read more at: '+pageURL+' )'
		);
	};
	
	/**
	 * Prepend a print link to page options
	 */
	addPrintOption = function () {
		// Find all links within .page-options that have link text of 'Printable version'
			printFriendlyLink = $('#pre-page-options > ul > li > a').filter(function(){
				return $(this).text() == 'Printable version' ? true : false;
			});
		
		// If no print friendly link, prepend the 'Print' option
			if (printFriendlyLink.size() == 0) {
				$('#pre-page-options > ul').prepend('<li><a href="#print" id="print-page" title="Print this page">Print</a></li>');
			}
		
		// Attach click handler to 'Print' option
			$('#print-page').click(function(){
				
				window.print();
				
				return false; // suppress following the link
			});
	};
	
	/**
	 * Populate share drop down. Only if share drop down
	 * has not been populated manually in the HTML.
	 */
	populateShare = function () {
		
		shareLink = $('#pre-page-options > ul > li > a').filter(function(){
			return $(this).text() == 'Share' ? true : false;
		});
		
		pageTitle = encodeURIComponent($('h1').first().text());
		
		
		shareLink.each(function(){
			// If share drop down has not been populated, populate it here
				if ($(this).siblings('ul').size() == 0) {
					$(this)
						.attr('href', $(this).attr('href')+'?title='+pageTitle)
						.after(
							'<ul>'+
							'<li><a href="http://www.qld.gov.au/share/?via=twitter&title='+pageTitle+'">Twitter</a></li>'+
							'<li><a href="http://www.qld.gov.au/share/?via=facebook&title='+pageTitle+'">Facebook</a></li>'+
							'<li><a href="http://www.qld.gov.au/share/?via=delicious&title='+pageTitle+'">Delicious</a></li>'+
							'<li><a href="http://www.qld.gov.au/share/?via=reddit&title='+pageTitle+'">Reddit</a></li>'+
							'<li><a href="http://www.qld.gov.au/share/?via=digg&title='+pageTitle+'">Digg</a></li>'+
							'<li><a href="http://www.qld.gov.au/share/?title='+pageTitle+'">More...</a></li>'+
							'</ul>'
						)
					;
				}
		});
		
	};
	
	/**
	 * Duplicates page options from #pre-page-options to #post-page-options
	 */
	duplicateOptionsToPost = function () {
		$('#post-page-options > ul').append($('#pre-page-options > ul > li').clone(true));
	};
	
	
	/**
	 * If a #page-feedback section exists, add a page option to toggle it's visibility
	 */
	addFeedbackOption = function () {
		if ($('#page-feedback').size() > 0) {
			$('#page-feedback').hide();
			
			sectionTitle = $('#page-feedback').find(':header:first').text();
			$('#post-page-options > ul').prepend('<li><a href="#page-feedback" id="page-feedback-toggle">'+sectionTitle+'</a></li>');
			
			$('#page-feedback-toggle')
				.data('feedbackSectionTitle', sectionTitle)
				.click(toggleFeedbackSection)
			;
		}
	};
	
	/**
	 * Toggle visibility of the feedback section
	 */
	toggleFeedbackSection = function () {
		if (!$('#page-feedback').is(':visible')) {
			// Update toggle
				$(this)
					.addClass('open')
					.attr('title', 'Hide the "'+$(this).data('feedbackSectionTitle')+'" section')
				;
			// Reveal section, and shift focus to revealed section (important for accessibility)
				$('#page-feedback')
					.fadeIn()
					.find('form:first')
						.attr('tabindex', 0)
						.focus()
				;
		} else {
			// Update toggle
				$(this)
					.removeClass('open')
					.attr('title', $(this).data('feedbackSectionTitle'))
				;
			// Hide section, don't shift focus
				$('#page-feedback')
					.fadeOut()
					.find('form:first')
						.attr('tabindex', -1)
				;
		}
		
		return false; // prevent link from being followed (default behaviour)
	};
	
})(jQuery); /* end closure */
} /* end if jQuery exists */