/**
 * test-cue-init.js
 * initialises testing for Queensland Government Consistent User Experience (CUE) template
 * 
 * loads libraries (jquery, YUI)
 * creates test suites: Markup, Presentation and Behaviour
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.1
 * @changelog
 *    * 0.1: Initial implementation based on previous (self contained) script
 */
 
// CUE object
var CUE = CUE || {};
CUE.testSuite = CUE.testSuite || {};


// initialise test objects
// create and add test suits
Tester = YUI({ logInclude: { TestRunner: true } }).use('console-filters', 'test', function(Y) {
	new Y.Console({
		logLevel: 'debug',
		height: '40em',
		newestOnTop: false,
		plugins: [ Y.Plugin.ConsoleFilters ]
	}).render('#log');
	
	CUE.testSuite.markup = new Y.Test.Suite("CUE 3.0 compliance: MARKUP");

	CUE.testSuite.presentation = new Y.Test.Suite({
		name: "CUE 3.0 compliance: PRESENTATION",
		
		setUp: function() {
			X_ORIGIN = $('#header .max-width').attr('offsetLeft') || 0;
		},
		
		tearDown: function() {
			delete X_ORIGIN;
		}
	});

	CUE.testSuite.behaviour = new Y.Test.Suite("CUE 3.0 compliance: BEHAVIOUR");

	$('body').addClass('yui3-skin-sam');
});
