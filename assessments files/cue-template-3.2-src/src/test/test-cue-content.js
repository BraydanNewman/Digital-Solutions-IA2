/**
 * test-cue-content.js
 * tests for content section of Consistent User Experience (CUE) template
 * 
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.2
 * @changelog
 *    * 0.1: Initial implementation (no tests)
 *    * 0.2: Implemented markup test
 */
 
Tester.use('console', 'test', function(Y) {

	var Assert = Y.Assert;

	CUE.testSuite.markup.add(new Y.Test.Case({
		name: "CUE : Markup : Content",
		
		// tests
		'main content should be contained in #content': function() {
			Assert.areSame(1, $('#content').length, 'not found');
			Assert.isTrue($('#content h1').length > 0, 'no H1 in content');
			Assert.areSame($('#content .article').length, $('.article').length, 'articles found outside #content');
		}

	}));

	
	CUE.testSuite.presentation.add(new Y.Test.Case({
		name: "CUE : Presentation : Content",
		
		// tests
		'breadcrumbs should have separator icon': function() {
			Assert.fail('not implemented');
		}

	}));

	
	CUE.testSuite.behaviour.add(new Y.Test.Case({
		name: "CUE : Behaviour : Content",
		
		// tests
		'page options should have drop down menus': function() {
			Assert.fail('not implemented');
		}

	}));
});
