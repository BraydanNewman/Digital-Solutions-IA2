/**
 * test-cue-footer.js
 * tests for footer section of Consistent User Experience (CUE) template
 * 
 * 
 * @see <a href="https://www.govdex.gov.au/confluence/display/QGWC/Conformance+requirements">Conformance requirements</a>
 *
 * @version 0.3
 * @changelog
 *    * 0.1: Initial implementation (no tests)
 *    * 0.2: Implemented H2 "Site footer", copyright statement and QG link tests
 *    * 0.3: Implemented markup tests
 */
 
Tester.use('console', 'test', function(Y) {

	var Assert = Y.Assert;

	CUE.testSuite.markup.add(new Y.Test.Case({
		name: "CUE : Markup : Footer",
		
		// tests
		'footer content should be contained in #footer in correct order': function() {
			Assert.areSame(1, $('#footer').length);
			var footer = $('#footer,#footer .box-sizing').last().children();
			Assert.isTrue(footer.eq(0).is('h2'));
			Assert.isTrue(footer.eq(1).is('ul'));
			Assert.isTrue(footer.eq(2).is('p'));
			Assert.isTrue(footer.eq(3).is('p'));
		},

		'fat footer content should be contained in #fat-footer': function() {
			var footerContents = $('#footer *').not($('#fat-footer, #fat-footer *'));
			Assert.areSame(1, footerContents.filter('h2').length, 'expected 1 h2');
			Assert.areSame(1, footerContents.filter('ul').length, 'expected 1 list');
			Assert.areSame(8, footerContents.filter('a').length, 'expected 8 links');
			Assert.areSame(3, footerContents.filter('p').length, 'expected 3 paragraphs');
		},

		'fat footer should have H2 heading': function() {
			Assert.areSame(1, $('#fat-footer h2').length);
		},

		'footer should have H2 "Site footer"': function() {
			Assert.areSame('Site footer', $('#footer h2').not('#fat-footer h2').eq(0).text());
		},

		'footer should contain the list of links defined in the CUE standard': function() {
			var links = $('#footer a').not('#fat-footer a');
			Assert.areSame('Copyright', links.eq(0).text());
			Assert.areSame('Disclaimer', links.eq(1).text());
			Assert.areSame('Privacy', links.eq(2).text());
			Assert.areSame('Right to information', links.eq(3).text());
			Assert.areSame('Accessibility', links.eq(4).text());
			Assert.areSame('Jobs in Queensland Government', links.eq(5).text());
			Assert.areSame('http://www.smartjobs.qld.gov.au/', links.eq(5).attr('href'));
			Assert.isNotNull(links.eq(6).text().match(/Other languages/));
			Assert.areSame('Queensland Government', links.eq(7).text());
		},

		'footer should contain a copyright statement': function() {
			var COPYRIGHT_SYMBOL = '\u00A9';

			var copyright = $('#footer p:contains("' + COPYRIGHT_SYMBOL + '")');
			Assert.areSame(1, copyright.length, 'not found');

			var EN_DASH = '\u2013';
			var CURRENT_YEAR = (new Date()).getFullYear();
			var format = '^' + COPYRIGHT_SYMBOL + ' The State of Queensland (?:\\([^)]+\\) ){0,1}\\d{4}' + EN_DASH + CURRENT_YEAR + '$';

			Assert.isNotNull(copyright.text().match(new RegExp(format)), 'format incorrect');
		},

		'footer should contain a Queensland Government link': function() {
			var qgLink = $('#footer a[href=http://www.qld.gov.au/]');
			Assert.areSame(1, qgLink.length);
			Assert.areSame('Queensland Government', qgLink.text());
			Assert.areSame('1', qgLink.attr('accesskey'));
		},

		'footer should contain a Queensland Government tagline': function() {
			var qgTagline = $('#footer #qg-branding');
			Assert.areSame(1, qgTagline.length);
			Assert.areSame('Great state. Great opportunity.', qgTagline.find('img').attr('alt'));
		}

	}));

	
	CUE.testSuite.presentation.add(new Y.Test.Case({
		name: "CUE : Presentation : Footer",
		
		// tests
		'fat footer should be visually distinct from the main content': function() {
			Assert.isTrue('not implemented');
		}

	}));
});
