/**
 * test-cue-body.js
 * tests for BODY section of Consistent User Experience (CUE) template
 * 
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.1
 * @changelog
 *    * 0.1: Initial implementation
 */
 
Tester.use('console', 'test', function(Y) {

	var Assert = Y.Assert;

	CUE.testSuite.markup.add(new Y.Test.Case({
		name: "CUE : Markup : Body",
		
		// tests
		'should have #qld-gov-au CSS signature': function() {
			Assert.areSame('qld-gov-au', $('body').attr('id'));
		}

	}));
});
