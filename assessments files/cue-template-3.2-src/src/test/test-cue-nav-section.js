/**
 * test-cue-nav-section.js
 * tests for section navigation section of Consistent User Experience (CUE) template
 * 
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.1
 * @changelog
 *    * 0.1: Initial implementation (no tests)
 */
 
Tester.use('console', 'test', function(Y) {

	var Assert = Y.Assert;

	CUE.testSuite.markup.add(new Y.Test.Case({
		name: "CUE : Markup : Section navigation",
		
		// tests
		'section navigation should be contained in #nav-section': function() {
			Assert.areSame(1, $('#nav-section').length, 'not found');
			var nav = $('#nav-section, #nav-section .box-sizing').last();
			Assert.isTrue(nav.children().eq(0).is('h2'));
			Assert.isTrue(nav.children().eq(1).is('ul'));
			Assert.areNotSame(0, $('#nav-section li a[href]').length, 'list of links not found');
		}

	}));

	
	CUE.testSuite.presentation.add(new Y.Test.Case({
		name: "CUE : Presentation : Section navigation",
		
		// tests
		'section navigation should appear as a nested list of links': function() {
			Assert.fail('not implemented');
		}

	}));

	
	CUE.testSuite.behaviour.add(new Y.Test.Case({
		name: "CUE : Behaviour : Section navigation",
		
		// tests
		'section navigation should be an expandable/collapsible tree menu': function() {
			Assert.fail('not implemented');
		}

	}));
});
