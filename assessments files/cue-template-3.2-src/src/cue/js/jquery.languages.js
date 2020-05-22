/**
 * This file contains a random language scroller. It updates
 * the text of the other languages link every 5 seconds with a
 * new random language supported by the www.qld.gov.au/languages
 * 
 * (based on ideas from http://www.communityservices.qld.gov.au/scripts/languages.js)
 * 
 * @requires jquery
 */
if (typeof jQuery != 'undefined') { /* Start if jQuery exists */
(function($) { /* start closure */
	
	var languages = [
		'<span lang=\"ar\">العربية</span>',
		'<span lang=\"el\">Ελληνικά</span>',		
		'<span lang=\"pl\">Polski</span>',
		'<span lang=\"bs\">Bosanksi</span>',
		'<span lang=\"id\">Bahasa Indonesia</span>',
		'<span lang=\"ru\">Русский</span>',
		'<span lang=\"zh\">中文</span>',
		'<span lang=\"it\">Italiano</span>',		
		'<span lang=\"sr\">српски</span>'	,
		'<span lang=\"hr\">Hrvatski</span>',
		'<span lang=\"ja\">日本語</span>',
		'<span lang=\"es\">Español</span>',
		'<span lang=\"fr\">Français</span>',	
		'<span lang=\"ko\">한국어</span>',
		'<span lang=\"tl\">Tagalog</span>',
		'<span lang=\"de\">Deutsch</span>',
		'<span lang=\"fa\">فارسی</span>',
		'<span lang=\"vi\">Tiếng Việt</span>'
	];
	
	var doctype = document.doctype ? document.doctype.publicId : document.firstChild.data;
	var XHTML = doctype.indexOf('XHTML') > 0;

	updateLanguage = function () {
		$('#languages a').empty().append(languages[Math.floor(Math.random()*languages.length)]+' (Other languages)');
		// copy @lang to @xml:lang for XHTML
		if (XHTML) {
			$('#languages span').attr('xml:lang', $('#languages span').attr('lang'));
		}
	};
	
	updateLanguage();
	window.setInterval(updateLanguage, 5000);
	

})(jQuery); /* end closure */
} /* end if jQuery exists */