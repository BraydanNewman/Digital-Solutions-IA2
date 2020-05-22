/**
 * test-cue-chrome.js
 * tests for browser chrome section of Consistent User Experience (CUE) template
 * 
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.1
 * @changelog
 *    * 0.1: Initial implementation based on previous (self contained) script
 */
 
Tester.use('console', 'test', function(Y) {

	var Assert = Y.Assert;

	CUE.testSuite.presentation.add(new Y.Test.Case({
		name: "CUE : Presentation : Chrome",
		
		// tests
		'favicon should be specified': function() {
			Assert.areSame('cue/images/favicon.ico', $('link[rel="shortcut icon"]').attr('href'));
		}

	}));
});
