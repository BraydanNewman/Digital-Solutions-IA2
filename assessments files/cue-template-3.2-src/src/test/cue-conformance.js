//<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
//<script type="text/javascript" src="http://yui.yahooapis.com/3.1.1/build/yui/yui-min.js"></script>
//<script type="text/javascript" src="cue-conformance.js"></script>


Tester = YUI({ logInclude: { TestRunner: true } }).use('console-filters', 'test', function(Y) {
	//initialize the console
	new Y.Console({
		logLevel: 'debug',
		height: '40em',
		newestOnTop: false,
		plugins: [ Y.Plugin.ConsoleFilters ]
	}).render('#log');

	$('body').addClass('yui3-skin-sam');
});


Tester.use('console', 'test', function(Y) {
	
	var Assert = Y.Assert;

	// markup test suite
	var testSuite = new Y.Test.Suite("CUE 3.0 compliance tests — MARKUP");

	testSuite.add(new Y.Test.Case({
		name: "cue/markup/head",
		
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
				Assert.isNotUndefined(html.getAttributeNS('xml', 'lang'), '@xml:lang is undefined');
				Assert.areSame(html.getAttribute('lang'), html.getAttribute('xml:lang'), '@xml:lang and @lang are not the same');
			}
		},

	}));

	testSuite.add(new Y.Test.Case({
		name: "cue/markup/footer",
		
		// tests

		'footer content should be contained in #footer': function() {
			Assert.areSame(1, $('#footer').length);
			// contents of footer checked in subsequent tests
		},

		'H2 "Site footer" should be present': function() {
			Assert.areSame('Site footer', $('#footer h2').text());
		},

		'should have "Right to Information" link': function() {
			Assert.fail();
		},
		
		'should have copyright statement': function() {
			Assert.areSame(1, $('#footer p').filter(function() {
				return $(this).text().match(/^\u00A9 The State of Queensland (\([^)]+\) ){0,1}\d{4}\.$/);
			}).length);
		},
		
		'should have link to "Queensland Government"': function() {
			var qgLink = $('#footer a[href=http://www.qld.gov.au/]');
			Assert.areSame(1, qgLink.length);
			Assert.areSame('Queensland Government', qgLink.text());
			Assert.areSame('1', qgLink.attr('accesskey'));
		}
	}));

	// add test suite
	Y.Test.Runner.add(testSuite);


	// behaviour test suite
	testSuite = new Y.Test.Suite("CUE 3.0 compliance tests — BEHAVIOUR");

	testSuite.add(new Y.Test.Case({
		name: "cue/behaviour/nav-section",
		
		setUp: function() {
		},

		tearDown: function() {
		},

		// tests
		'should be a nested list of links': function() {
			var navSection = $('#nav-section');
			Assert.isTrue(navSection.find('ul').length > 0);
		},
		
		'should start with all nodes collapsed except path leading to current page': function() {
			Assert.areSame(0, $('#nav-section .inner > ul > li:hidden').length, 'top level section navigation must not be hidden');
			Assert.areSame($('#nav-section .inner > ul > li > ul').length, $('#nav-section .inner > ul > li > ul:hidden').length + 1, 'only one section should be expanded');
			// expanded node is for "current page"
			Assert.fail('partial implementation');
		},

		'should be a way to specify which link represents the current page if cannot be determined from URL or page title': function() {
			Assert.fail('not implemented');
		},

		'should be a toggle UI element for each submenu': function() {
			// toggle UI element must have text of [+]
			// toggle UI element must be replaced by plus icon distributed with template
			// title attribute must read "Open the x submenu" where x is the name of the menu
			Assert.fail('not implemented');
		},
		
		'should expand/collapse menu when toggle activated': function() {
			// test onclick
			// test keypress 'Enter'
			// could we just verify it is an A element with @href?
			Assert.fail('not implemented');
		},

		'the toggle UI element should be updated when expanded': function() {
			// toggle UI element must have text of [-]
			// toggle UI element must be replaced by minus icon distributed with the template
			// title attribute must be updated to “Close the x submenu”.
			Assert.fail('not implemented');
		}

	}));

	// add test suite
	Y.Test.Runner.add(testSuite);
});


Tester.use('test', function(Y) {
	Y.Test.Runner.run();
});
