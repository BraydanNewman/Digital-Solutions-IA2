/**
 * test-cue-head.js
 * tests for HEAD section of Consistent User Experience (CUE) template
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

	CUE.testSuite.markup.add(new Y.Test.Case({
		name: "CUE : Markup : Head",
		
		setUp: function() {
			doctype = document.doctype ? document.doctype.publicId : document.firstChild.data;
		},

		tearDown: function() {
			delete doctype;
		},


		// tests
		'should have HTML4.01 or XHTML1.0 doctype': function() {
			Assert.isNotNull(doctype.match(/(XHTML 1.0)|(HTML 4.01)/));
		},

		'should have lang attribute specified on HTML tag': function() {
			var html = $('html').get(0);
			Assert.isNotUndefined(html.getAttribute('lang'), '@lang is undefined');
			if (doctype.match(/XHTML/)) {
				Assert.areSame(html.getAttribute('lang'), html.getAttribute('xml:lang'), '@xml:lang and @lang are not the same');
			}
		}

	}));
});
