/**
 * test-cue-run.js
 * runs tests
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
 
Tester.use("test", function(Y) {
	Y.Test.Runner.add(CUE.testSuite.markup);
	Y.Test.Runner.add(CUE.testSuite.presentation);
	Y.Test.Runner.add(CUE.testSuite.behaviour);

	Y.Test.Runner.run();
});
