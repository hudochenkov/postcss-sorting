import groupTest from './_group-test';

groupTest([
	{
		options: {
			'rule-nested-empty-line-before': true
		},
		cases: [
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\r\nb {}',
				expected: 'a {}\r\nb {}',
				description: 'non-nested node ignored and CRLF',
			},
			{
				fixture: '@media {\n\n  a {}\n\n}',
				expected: '@media {\n\n  a {}\n\n}',
			},
			{
				fixture: '@media {\r\n\r\n  a {}\r\n\r\n}',
				expected: '@media {\r\n\r\n  a {}\r\n\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\r\n  a {}\n\r\n}',
				expected: '@media {\n\r\n  a {}\n\r\n}',
				description: 'Mixed',
			},
			{
				fixture: '@media {\n\n  a {}\n\n  b{}\n\n}',
				expected: '@media {\n\n  a {}\n\n  b{}\n\n}',
			},
			{
				fixture: '@media {\n\n\ta {}\n\n\tb{}\n}',
				expected: '@media {\n\n\ta {}\n\n\tb{}\n}',
			},
			{
				fixture: '@media {\r\n\r\n\ta {}\r\n\r\n\tb{}\r\n}',
				expected: '@media {\r\n\r\n\ta {}\r\n\r\n\tb{}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n\ta {}}',
				expected: '@media {\n\n\ta {}}',
			},
			{
				fixture: '@media {\n\na {}\n/* comment */\n\nb {}}',
				expected: '@media {\n\na {}\n/* comment */\n\nb {}}',
			},
			{
				fixture: '@media {\r\n\r\na {}\r\n/* comment */\r\n\r\nb {}}',
				expected: '@media {\r\n\r\na {}\r\n/* comment */\r\n\r\nb {}}',
				description: 'CRLF',
			},
			{
				fixture: '@media { b {} }',
				expected: '@media {\n\n b {} }',
			},
			{
				fixture: '@media {\n\n  b {} a {} }',
				expected: '@media {\n\n  b {}\n\n a {} }',
			},
			{
				fixture: '@media {\r\n\r\n  b {} a {} }',
				expected: '@media {\r\n\r\n  b {}\n\n a {} }',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n  b {}\n  a {}\n\n}',
				expected: '@media {\n\n  b {}\n\n  a {}\n\n}',
			},
			{
				fixture: '@media {\n  b {}\n\n  a {}\n\n}',
				expected: '@media {\n\n  b {}\n\n  a {}\n\n}',
			},
			{
				fixture: '@media {\r\n  b {}\r\n\r\n  a {}\r\n\r\n}',
				expected: '@media {\n\r\n  b {}\r\n\r\n  a {}\r\n\r\n}',
				description: 'CRLF',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': [true, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: '@media {\n  a {}\n\n}',
				expected: '@media {\n  a {}\n\n}',
			},
			{
				fixture: '@media {\r\n  a {}\r\n\r\n}',
				expected: '@media {\r\n  a {}\r\n\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n  a {}\n\n  b{}\n\n}',
				expected: '@media {\n  a {}\n\n  b{}\n\n}',
			},
			{
				fixture: '@media {\n\ta {}\n\n\tb{}\n}',
				expected: '@media {\n\ta {}\n\n\tb{}\n}',
			},
			{
				fixture: '@media {\n\ta {}}',
				expected: '@media {\n\ta {}}',
			},
			{
				fixture: '@media {\r\n\ta {}}',
				expected: '@media {\r\n\ta {}}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\na {}\n/* comment */\n\nb {}}',
				expected: '@media {\na {}\n/* comment */\n\nb {}}',
			},
			{
				fixture: '@media {\r\na {}\r\n/* comment */\r\n\r\nb {}}',
				expected: '@media {\r\na {}\r\n/* comment */\r\n\r\nb {}}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n  a {}\n}',
				expected: '@media {\n  a {}\n}',
			},
			{
				fixture: '@media {\n\n  a {}\n\n  b{}\n}',
				expected: '@media {\n  a {}\n\n  b{}\n}',
			},
			{
				fixture: '@media {\r\n\r\n  a {}\r\n\r\n  b{}\r\n}',
				expected: '@media {\r\n  a {}\r\n\r\n  b{}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n  b {} a {} }',
				expected: '@media {\n  b {}\n\n a {} }',
			},
			{
				fixture: '@media {\r\n  b {} a {} }',
				expected: '@media {\r\n  b {}\n\n a {} }',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n  b {}\n  a {}\n\n}',
				expected: '@media {\n  b {}\n\n  a {}\n\n}',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': [true, { except: ['after-rule'] }]
		},
		cases: [
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {\n color: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
				expected: 'a {\n color: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
				description: 'css property',
			},
			{
				fixture: 'a {\n $var: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
				expected: 'a {\n $var: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
				description: 'scss variable',
			},
			{
				fixture: 'a {\n --custom-prop: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
				expected: 'a {\n --custom-prop: pink; \n\n b {color: red; } \n c {color: blue; }\n}',
				description: 'custom property',
			},
			{
				fixture: 'a {\n @media {\n\n   b {}\n }\n\n c {}\n d {}\n}',
				expected: 'a {\n @media {\n\n   b {}\n }\n\n c {}\n d {}\n}',
				description: 'media rule',
			},
			{
				fixture: 'a {\n color: pink; \r\n\r\n b {color: red; } \n c {color: blue; }\n}',
				expected: 'a {\n color: pink; \r\n\r\n b {color: red; } \n c {color: blue; }\n}',
				description: 'CRLF',
			},
			{
				fixture: 'a {\n color: pink; b {color: red; }\n c {color: blue; }\n}',
				expected: 'a {\n color: pink;\n\n b {color: red; }\n c {color: blue; }\n}',
			},
			{
				fixture: 'a {\n color: pink;\n b {color: red; }\n c {color: blue; }\n}',
				expected: 'a {\n color: pink;\n\n b {color: red; }\n c {color: blue; }\n}',
			},
			{
				fixture: 'a {\n color: pink;\n\n b {color: red; }\n\n c {color: blue; }\n}',
				expected: 'a {\n color: pink;\n\n b {color: red; }\n c {color: blue; }\n}',
			},
			{
				fixture: 'a {\n @media {\n\n   b {}\n }\n c {}\n d {}\n}',
				expected: 'a {\n @media {\n\n   b {}\n }\n\n c {}\n d {}\n}',
				description: 'media rule',
			},
			{
				fixture: 'a {\r\n color: pink;\r\n b {\r\ncolor: red; \r\n}\r\n c {\r\ncolor: blue; \r\n}\r\n}',
				expected: 'a {\r\n color: pink;\n\r\n b {\r\ncolor: red; \r\n}\r\n c {\r\ncolor: blue; \r\n}\r\n}',
				description: 'CRLF',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': [true, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: '@media {\n  /* foo */\n  a {}\n}',
				expected: '@media {\n  /* foo */\n  a {}\n}',
			},
			{
				fixture: '@media {\r\n  /* foo */\r\n  a {}\r\n}',
				expected: '@media {\r\n  /* foo */\r\n  a {}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n  /* foo */\n\n  a {}\n}',
				expected: '@media {\n  /* foo */\n\n  a {}\n}',
			},
			{
				fixture: '@media {\r\n  /* foo */\r\n\r\n  a {}\r\n}',
				expected: '@media {\r\n  /* foo */\r\n\r\n  a {}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n  a{}\n  b {}\n\n}',
				expected: '@media {\n\n  a{}\n\n  b {}\n\n}',
			},
			{
				fixture: '@media {\r\n\r\n  a{}\r\n  b {}\r\n\r\n}',
				expected: '@media {\r\n\r\n  a{}\n\r\n  b {}\r\n\r\n}',
				description: 'CRLF',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': false
		},
		cases: [
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: '@media {\n  a {}\n}',
				expected: '@media {\n  a {}\n}',
			},
			{
				fixture: '@media {\r\n  a {}\r\n}',
				expected: '@media {\r\n  a {}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n  a {} b{}\n}',
				expected: '@media {\n  a {} b{}\n}',
			},
			{
				fixture: '@media {\n\ta {}\n\tb{}\n}',
				expected: '@media {\n\ta {}\n\tb{}\n}',
			},
			{
				fixture: '@media {\r\n\ta {}\r\n\tb{}\r\n}',
				expected: '@media {\r\n\ta {}\r\n\tb{}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\ta {}}',
				expected: '@media {\n\ta {}}',
			},
			{
				fixture: '@media {\na {}\n/* comment */\nb {}}',
				expected: '@media {\na {}\n/* comment */\nb {}}',
			},
			{
				fixture: '@media {\r\na {}\r\n/* comment */\r\nb {}}',
				expected: '@media {\r\na {}\r\n/* comment */\r\nb {}}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n  a {}\n\n}',
				expected: '@media {\n  a {}\n\n}',
			},
			{
				fixture: '@media {\n  a {}\n\n  b{}\n\n}',
				expected: '@media {\n  a {}\n  b{}\n\n}',
			},
			{
				fixture: '@media {\ta {}\n\n\tb{}\n}',
				expected: '@media {\ta {}\n\tb{}\n}',
			},
			{
				fixture: '@media {\ta {}\r\n\r\n\tb{}\r\n}',
				expected: '@media {\ta {}\r\n\tb{}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n\ta {}}',
				expected: '@media {\n\ta {}}',
			},
			{
				fixture: '@media {\na {}\n/* comment */\n\nb {}}',
				expected: '@media {\na {}\n/* comment */\nb {}}',
			},
			{
				fixture: '@media {\r\na {}\r\n/* comment */\r\n\r\nb {}}',
				expected: '@media {\r\na {}\r\n/* comment */\r\nb {}}',
				description: 'CRLF',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': [false, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: '@media {\n  /* foo */\n  a {}\n}',
				expected: '@media {\n  /* foo */\n  a {}\n}',
			},
			{
				fixture: '@media {\n  /* foo */\n\n  a {}\n}',
				expected: '@media {\n  /* foo */\n\n  a {}\n}',
			},
			{
				fixture: '@media {\r\n  /* foo */\r\n\r\n  a {}\r\n}',
				expected: '@media {\r\n  /* foo */\r\n\r\n  a {}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n  a{}\n\n  b {}\n}',
				expected: '@media {\n  a{}\n  b {}\n}',
			},
			{
				fixture: '@media {\r\n  a{}\r\n\r\n  b {}\r\n}',
				expected: '@media {\r\n  a{}\r\n  b {}\r\n}',
				description: 'CRLF',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': [false, { except: ['after-rule'] }]
		},
		cases: [
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {\n color: pink; \n b {color: red; } \n\n c {color: blue; }\n}',
				expected: 'a {\n color: pink; \n b {color: red; } \n\n c {color: blue; }\n}',
				description: 'css property',
			},
			{
				fixture: 'a {\n $var: pink; \n b {color: red; } \n\n c {color: blue; }\n}',
				expected: 'a {\n $var: pink; \n b {color: red; } \n\n c {color: blue; }\n}',
				description: 'scss variable',
			},
			{
				fixture: 'a {\n --custom-prop: pink; \n b {color: red; } \n\n c {color: blue; }\n}',
				expected: 'a {\n --custom-prop: pink; \n b {color: red; } \n\n c {color: blue; }\n}',
				description: 'custom property',
			},
			{
				fixture: 'a {\n @media {\n   b {}\n }\n c {}\n\n d {}\n}',
				expected: 'a {\n @media {\n   b {}\n }\n c {}\n\n d {}\n}',
				description: 'media rule',
			},
			{
				fixture: 'a {\n color: pink; \r\n b {color: red; } \n\n c {color: blue; }\n}',
				expected: 'a {\n color: pink; \r\n b {color: red; } \n\n c {color: blue; }\n}',
				description: 'CRLF',
			},
			{
				fixture: 'a {\n color: pink;\n b {color: red; }\n c {color: blue; }\n}',
				expected: 'a {\n color: pink;\n b {color: red; }\n\n c {color: blue; }\n}',
			},
			{
				fixture: 'a {\n color: pink;\n\n b {color: red; } \n\n c {color: blue; }\n}',
				expected: 'a {\n color: pink;\n b {color: red; } \n\n c {color: blue; }\n}',
			},
			{
				fixture: 'a {\n @media {\n   b {}\n }\n\n c {}\n\n d {}\n}',
				expected: 'a {\n @media {\n   b {}\n }\n c {}\n\n d {}\n}',
				description: 'media rule',
			},
			{
				fixture: 'a {\r\n color: pink;\r\n\r\n b {color: red; }\r\n\r\n c {color: blue; }\r\n}',
				expected: 'a {\r\n color: pink;\r\n b {color: red; }\r\n\r\n c {color: blue; }\r\n}',
				description: 'CRLF',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': 'always-multi-line'
		},
		cases: [
			{
				fixture: '@media { a { color:pink; } b { top: 0; } }',
				expected: '@media { a { color:pink; } b { top: 0; } }',
				description: 'single-line ignored',
			},
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: '@media {\n\n  a {\n    color: pink;\n}\n\n}',
				expected: '@media {\n\n  a {\n    color: pink;\n}\n\n}',
			},
			{
				fixture: '@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\r\n\r\n}',
				expected: '@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\r\n\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}',
				expected: '@media {\n\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}',
			},
			{
				fixture: '@media {\n\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}',
				expected: '@media {\n\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}',
			},
			{
				fixture: '@media {\r\n\r\n\ta {\r\n\t\tcolor: pink; }\r\n\r\n\tb{\r\n\t\ttop: 0; }\r\n}',
				expected: '@media {\r\n\r\n\ta {\r\n\t\tcolor: pink; }\r\n\r\n\tb{\r\n\t\ttop: 0; }\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}',
				expected: '@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}',
			},
			{
				fixture: '@media {\n  a {\n    color: pink;\n}\n\n}',
				expected: '@media {\n\n  a {\n    color: pink;\n}\n\n}',
			},
			{
				fixture: '@media {\n\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}',
				expected: '@media {\n\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}',
			},
			{
				fixture: '@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}',
				expected: '@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\n\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}',
				expected: '@media {\n\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}',
			},
			{
				fixture: '@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}',
				expected: '@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}',
			},
			{
				fixture: '@media {\r\n\r\na {\r\n\t\tcolor: pink; }\r\n/* comment */\r\nb {\r\n\t\ttop: 0; }}',
				expected: '@media {\r\n\r\na {\r\n\t\tcolor: pink; }\r\n/* comment */\n\r\nb {\r\n\t\ttop: 0; }}',
				description: 'CRLF',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': ['always-multi-line', { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: '@media { a { color:pink; } b { top: 0; } }',
				expected: '@media { a { color:pink; } b { top: 0; } }',
				description: 'single-line ignored',
			},
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\r\nb {}',
				expected: 'a {}\r\nb {}',
				description: 'non-nested node ignored and CRLF',
			},
			{
				fixture: '@media {\n  a {\n    color: pink;\n}\n\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n\n}',
			},
			{
				fixture: '@media {\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}',
			},
			{
				fixture: '@media {\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}',
				expected: '@media {\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}',
			},
			{
				fixture: '@media {\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}',
				expected: '@media {\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}',
			},
			{
				fixture: '@media {\r\na {\r\n\t\tcolor: pink; }\r\n/* comment */\r\n\r\nb {\r\n\t\ttop: 0; }}',
				expected: '@media {\r\na {\r\n\t\tcolor: pink; }\r\n/* comment */\r\n\r\nb {\r\n\t\ttop: 0; }}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n\n  a {\n    color: pink;\n}\n\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n\n}',
			},
			{
				fixture: '@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}',
			},
			{
				fixture: '@media {\r\n  a {\r\n    color: pink;\r\n}\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}',
				expected: '@media {\r\n  a {\r\n    color: pink;\r\n}\n\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}',
				expected: '@media {\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}',
			},
		],
	},
	{
		options: {
			'rule-nested-empty-line-before': ['never-multi-line']
		},
		cases: [
			{
				fixture: '@media {\n\na { color:pink; }\n\nb { top: 0; } }',
				expected: '@media {\n\na { color:pink; }\n\nb { top: 0; } }',
				description: 'single-line ignored',
			},
			{
				fixture: '@media {\r\n\r\na { color:pink; }\r\n\r\nb { top: 0; } }',
				expected: '@media {\r\n\r\na { color:pink; }\r\n\r\nb { top: 0; } }',
				description: 'single-line ignored and CRLF',
			},
			{
				fixture: 'a {} b {}',
				expected: 'a {} b {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: 'a {}\nb {}',
				expected: 'a {}\nb {}',
				description: 'non-nested node ignored',
			},
			{
				fixture: '@media {\n  a {\n    color: pink;\n}\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n}',
			},
			{
				fixture: '@media {\r\n  a {\r\n    color: pink;\r\n}\r\n}',
				expected: '@media {\r\n  a {\r\n    color: pink;\r\n}\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n}',
			},
			{
				fixture: '@media {\ta {\n\t\tcolor: pink; }\n\tb{\n\t\ttop: 0; }\n}',
				expected: '@media {\ta {\n\t\tcolor: pink; }\n\tb{\n\t\ttop: 0; }\n}',
			},
			{
				fixture: '@media {\ta {\r\n\t\tcolor: pink; }\r\n\tb{\r\n\t\ttop: 0; }\r\n}',
				expected: '@media {\ta {\r\n\t\tcolor: pink; }\r\n\tb{\r\n\t\ttop: 0; }\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}',
				expected: '@media {\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}',
			},
			{
				fixture: '@media {\n\n  a {\n    color: pink;\n}\n\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n\n}',
			},
			{
				fixture: '@media {\n\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}',
				expected: '@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}',
			},
			{
				fixture: '@media {\r\n\r\n  a {\r\n    color: pink;\r\n}\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}',
				expected: '@media {\r\n  a {\r\n    color: pink;\r\n}\r\n  b {\r\n    top: 0;\r\n}\r\n\r\n}',
				description: 'CRLF',
			},
			{
				fixture: '@media {\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}',
				expected: '@media {\ta {\n\t\tcolor: pink; }\n\tb{\n\t\ttop: 0; }\n}',
			},
			{
				fixture: '@media { a {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}',
				expected: '@media { a {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}',
			},
		],
	},
]);
