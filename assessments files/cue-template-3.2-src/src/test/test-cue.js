/**
 * test-cue.js
 * manages testing for Queensland Government Consistent User Experience (CUE) template
 * 
 * loads libraries (jquery, YUI)
 * creates test suites: Markup, Presentation and Behaviour
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.2
 * @changelog
 *    * 0.1: Initial implementation based on previous (self contained) script
 *    * 0.2: added test-cue-chrome.js (browser chrome tests)
 */
 
// load jquery
;if(typeof(jQuery)=="undefined") {
	document.write('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>');
}

// load YUI
if(typeof(YUI)=="undefined") {
	document.write('<script type="text/javascript" src="http://yui.yahooapis.com/3.1.1/build/yui/yui-min.js"></script>');
}


// initialise test objects
document.write('<script type="text/javascript" src="pxToEm.js"></script>');
document.write('<script type="text/javascript" src="test-cue-init.js"></script>');

// load tests
document.write('<script type="text/javascript" src="test-cue-chrome.js"></script>');
document.write('<script type="text/javascript" src="test-cue-head.js"></script>');
document.write('<script type="text/javascript" src="test-cue-body.js"></script>');
document.write('<script type="text/javascript" src="test-cue-header.js"></script>');
document.write('<script type="text/javascript" src="test-cue-content.js"></script>');
if (document.getElementById('nav-site')) document.write('<script type="text/javascript" src="test-cue-nav-site.js"></script>');
if (document.getElementById('nav-section')) document.write('<script type="text/javascript" src="test-cue-nav-section.js"></script>');
document.write('<script type="text/javascript" src="test-cue-footer.js"></script>');

// run tests
document.write('<script type="text/javascript" src="test-cue-run.js"></script>');
