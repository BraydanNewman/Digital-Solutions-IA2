/**
 * test-cue-header.js
 * tests for header section of Consistent User Experience (CUE) template
 * 
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.5
 * @changelog
 *    * 0.1: Initial implementation (no tests)
 *    * 0.2: Implemented #access tests
 *    * 0.3: Fixed #access tests for IE6 (ignore elements inserted before #access)
 *    * 0.4: test: header and banner elements should be within #header in correct order
 *    * 0.5: implemented all header markup tests
 */
 
Tester.use('console', 'test', function(Y) {

	var Assert = Y.Assert;

	CUE.testSuite.markup.add(new Y.Test.Case({
		name: "CUE : Markup : Header",
		
		// tests
		'first element should be #access': function() {
			Assert.areSame('access', $('body').children(':not([id^="yui"],script,#text-resize)').eq(0).attr('id'));
			Assert.areSame('Skip links and keyboard navigation', $('#access').children().eq(0).filter('h2').text(), 'H2 "Skip links" expected');
			Assert.isTrue($('#access').children().eq(1).is('ul'), 'list not found');
			Assert.areNotSame(0, $('#access li [href]').length, 'list of links not found');
			Assert.areSame('Skip to content', $('#access li a').eq(0).text());
			Assert.areSame('#content', $('#access li a').eq(0).attr('href'));
		},
		
		'should have link to accessibility statement': function() {
			var statement = $('#access a:contains("tab and cursor keys")');
			Assert.areSame(1, statement.length, 'not found');
			Assert.areSame('Use tab and cursor keys to move around the page (more information)', statement.text());
		},
		
		'header and banner elements should be within #header in correct order': function() {
			Assert.areSame(1, $('#header').length, '#header not found');

			var headerElements = $('#header h2').parent().children();
			Assert.areSame(4, headerElements.length, '#header children count failed');

			Assert.isTrue(headerElements.eq(0).is('h2'));
			Assert.areSame('Site header', headerElements.eq(0).text());
			Assert.areSame('qg-coa', headerElements.eq(1).attr('id'));
			Assert.areSame('tools', headerElements.eq(2).attr('id'));
			Assert.areSame('site-name', headerElements.eq(3).attr('id'));
		},
		
		'coa should link to www.qld.gov.au and contain Queensland Government Coat of Arms': function() {
			var coa = $('#qg-coa');
			Assert.areSame('http://www.qld.gov.au/', coa.attr('href'));
			// TODO: test img is correct qld government Coat of Arms
			Assert.areSame('Queensland Government', coa.find('img[alt]').attr('alt'));
		},
		
		'tools element must contain the tool navigation menu including search form': function() {
			var tools = $('#tools');
			Assert.areSame('Site map', tools.find('a').eq(0).text());
			Assert.areSame('Contact us', tools.find('a').eq(1).text());
			Assert.areSame('Help', tools.find('a').eq(2).text());
			Assert.areSame('Site map', tools.find('label').eq(0).text());
			Assert.areSame(1, tools.find('#search-form').length, 'search form missing from tools');
		},
		
		'search input should be called #search-query and have correct size': function() {
			var search = $('#tools input#search-query');
			Assert.areSame(1, search.length, 'input#search-query missing from #tools');
			Assert.areEqual(27, search.attr('size'));
		},
		
		'site name should link to website homepage ': function() {
			Assert.areSame('/', $('#site-name a').attr('href'));
		}

	}));

	
	CUE.testSuite.presentation.add(new Y.Test.Case({
		name: "CUE : Presentation : Header",
		
		setUp: function() {
			var span = $('<span>M</span>');
			span.appendTo('#header');
			EM = span.attr('offsetHeight');
			span.remove();
		},
		
		tearDown: function() {
			delete EM;
		},
		
		// tests
		'Coat of Arms should be positioned accurately from top and left': function() {
			var coa = $('#qg-coa');
			Assert.areSame(12, coa.attr('offsetTop'), 'coa is not 12px from top');
			// TODO if max-width in play, 5px from the left; otherwise 5px + .7em.
			Assert.areSame((0.7 * EM) + 5, coa.attr('offsetLeft') - X_ORIGIN, 'coa is not 0.7em+5px from left');
		}

	}));
});
