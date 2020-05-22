/**
 * test-cue-nav-site.js
 * tests for site navigation section of Consistent User Experience (CUE) template
 * 
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.2
 * @changelog
 *    * 0.1: Initial implementation (no tests)
 *    * 0.2: Implemented: markup test, presentation (only one level of menus)
 */
 
Tester.use('console', 'test', function(Y) {

	var Assert = Y.Assert;

	CUE.testSuite.markup.add(new Y.Test.Case({
		name: "CUE : Markup : Site navigation",
		
		// tests
		'site navigation should be contained in #nav-site': function() {
			Assert.areSame(1, $('#nav-site').length, 'not found');
			var nav = $('#nav-site, #nav-site .max-width').last();
			Assert.isTrue(nav.children().eq(0).is('h2'));
			Assert.areSame('Site navigation', nav.children().eq(0).text());
			Assert.isTrue(nav.children().eq(1).is('ul'));
			Assert.areNotSame(0, $('#nav-site li a[href]').length, 'list of links not found');
		}

	}));

	
	CUE.testSuite.presentation.add(new Y.Test.Case({
		name: "CUE : Presentation : Site navigation",
		
		// tests
		'site navigation should appear as a horizontal bar below the header': function() {
			// horizontal bar
			// TODO take "max width" into consideration
			Assert.areSame($('#nav-site').attr('offsetWidth'), $('body').attr('offsetWidth'), 'nav-site does not fill viewport width');
			// below the header
			Assert.areSame($('#nav-site').attr('offsetTop'), $('#header').attr('offsetTop') + $('#header').attr('offsetHeight'), 'expected nav-site below header');
		},
		
		'bar should have a height of 2.2em per row': function() {
			// TODO calculate number of rows
			var rows = 1;
			Assert.areSame(parseInt('2.2'.pxToEm({ reverse: true }), 10) * rows, $('#nav-site').attr('offsetHeight'));
		},
		
		'only one level of drop-downs should be used': function() {
			Assert.areSame(0, $('#nav-site li li li').length);
		}

	}));

	
	CUE.testSuite.behaviour.add(new Y.Test.Case({
		name: "CUE : Behaviour : Site navigation",
		
		// tests
		'hovering over a link should display a drop-down menu': function() {
			Assert.fail('not implemented');
		}

	}));
});
