import groupTest from './_group-test';

groupTest([
	{
		options: {
			'declaration-empty-line-before': true
		},
		cases: [
			{
				fixture: 'a { top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
			{
				fixture: 'a {\ntop: 15px;\n}',
				expected: 'a {\n\ntop: 15px;\n}',
			},
			{
				fixture: 'a {\r\ntop: 15px;\r\n}',
				expected: 'a {\n\r\ntop: 15px;\r\n}',
			},
			{
				fixture: 'a{\n\n top: 15px;\n bottom: 5px;}',
				expected: 'a{\n\n top: 15px;\n\n bottom: 5px;}',
			},
			{
				fixture: 'a{\r\n\r\n top: 15px;\r\n bottom: 5px;}',
				expected: 'a{\r\n\r\n top: 15px;\n\r\n bottom: 5px;}',
			},
			{
				fixture: 'a{\n --custom-prop: value;\n top: 15px;}',
				expected: 'a{\n --custom-prop: value;\n\n top: 15px;}',
			},
			{
				fixture: 'a{\n @extends .class;\r\n top: 15px;}',
				expected: 'a{\n @extends .class;\n\r\n top: 15px;}',
			},
			{
				fixture: 'a{\n $var: 15px;\n top: 15px;}',
				expected: 'a{\n $var: 15px;\n\n top: 15px;}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [true, { ignore: ['inside-single-line-block'] }]
		},
		cases: [
			{
				fixture: 'a { top: 15px; }',
				expected: 'a { top: 15px; }',
			},
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [true, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n/* comment */ top: 15px;\n}',
				expected: 'a {\n/* comment */ top: 15px;\n}',
			},
			{
				fixture: 'a {\n/* comment */\ntop: 15px;\n}',
				expected: 'a {\n/* comment */\ntop: 15px;\n}',
			},
			{
				fixture: 'a {\r\n/* comment */\r\ntop: 15px;\r\n}',
				expected: 'a {\r\n/* comment */\r\ntop: 15px;\r\n}',
			},
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [true, { ignore: ['after-declaration'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n top: 15px; bottom: 5px;\n}',
				expected: 'a {\n\n top: 15px; bottom: 5px;\n}',
			},
			{
				fixture: 'a {\r\n\r\n top: 15px; bottom: 5px;\r\n}',
				expected: 'a {\r\n\r\n top: 15px; bottom: 5px;\r\n}',
			},
			{
				fixture: 'a {\n\n top: 15px;\n bottom: 5px;\n}',
				expected: 'a {\n\n top: 15px;\n bottom: 5px;\n}',
			},
			{
				fixture: 'a {\r\n\r\n top: 15px;\r\n bottom: 5px;\r\n}',
				expected: 'a {\r\n\r\n top: 15px;\r\n bottom: 5px;\r\n}',
			},
			{
				fixture: 'a {\n\n top: 15px;\n\n bottom: 5px;\n}',
				expected: 'a {\n\n top: 15px;\n\n bottom: 5px;\n}',
			},
			{
				fixture: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
				expected: 'a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}',
			},
			{
				fixture: 'a{\n @extends .class;\n top: 15px;\n}',
				expected: 'a{\n @extends .class;\n\n top: 15px;\n}',
			},
			{
				fixture: 'a{\r\n @extends .class;\r\n top: 15px;\r\n}',
				expected: 'a{\r\n @extends .class;\n\r\n top: 15px;\r\n}',
			},
			{
				fixture: 'a{\n @include mixin;\n top: 15px;\n}',
				expected: 'a{\n @include mixin;\n\n top: 15px;\n}',
			},
			{
				fixture: 'a{\r\n @include mixin;\r\n top: 15px;\r\n}',
				expected: 'a{\r\n @include mixin;\n\r\n top: 15px;\r\n}',
			},
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
			{
				fixture: 'a {\r\n top: 15px;\r\n}',
				expected: 'a {\n\r\n top: 15px;\r\n}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [true, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a { top: 15px;\n}',
				expected: 'a { top: 15px;\n}',
			},
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n top: 15px;\n}',
			},
			{
				fixture: 'a {\r\n top: 15px;\r\n}',
				expected: 'a {\r\n top: 15px;\r\n}',
			},
			{
				fixture: 'a {\n\n top: 15px;\n}',
				expected: 'a {\n top: 15px;\n}',
			},
			{
				fixture: 'a {\r\n\r\n top: 15px;\r\n}',
				expected: 'a {\r\n top: 15px;\r\n}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [true, { except: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
			{
				fixture: 'a {/* I am a comment */ \n bottom: 5px;}',
				expected: 'a {/* I am a comment */\n \n bottom: 5px;}',
			},
			{
				fixture: 'a {/* I am a comment */ \r\n bottom: 5px;}',
				expected: 'a {/* I am a comment */\n \r\n bottom: 5px;}',
			},
			{
				fixture: 'a {\n\n top: 15px;\n /* I am a comment */ \n\n bottom: 5px;}',
				expected: 'a {\n\n top: 15px;\n /* I am a comment */ \n bottom: 5px;}',
			},
			{
				fixture: 'a {\n /* I am a comment */ \r\n\r\n bottom: 5px;}',
				expected: 'a {\n /* I am a comment */ \r\n bottom: 5px;}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [true, { except: ['after-declaration'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
			{
				fixture: 'a {\n\n top:15px; \n bottom: 5px;}',
				expected: 'a {\n\n top:15px; \n bottom: 5px;}',
			},
			{
				fixture: 'a {\n\n top:15px; \r\n bottom: 5px;}',
				expected: 'a {\n\n top:15px; \r\n bottom: 5px;}',
			},
			{
				fixture: 'a {\n\n top:15px;\n\n bottom: 5px;}',
				expected: 'a {\n\n top:15px;\n bottom: 5px;}',
			},
			{
				fixture: 'a {\n\n top: 15px;\r\n\r\n bottom: 5px;}',
				expected: 'a {\n\n top: 15px;\r\n bottom: 5px;}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [true, { except: ['first-nested', 'after-comment', 'after-declaration'] }]
		},
		cases: [
			{
				fixture: `a {\n top: 15px; \n bottom: 5px; \n /* comment */ \n prop: 15px;\n\n @extends 'x';\n\n prop: 15px; \n & b {\n prop: 15px;\n } \n\n prop: 15px; \n }`,
				expected: `a {\n top: 15px; \n bottom: 5px; \n /* comment */ \n prop: 15px;\n\n @extends 'x';\n\n prop: 15px; \n & b {\n prop: 15px;\n } \n\n prop: 15px; \n }`,
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [false]
		},
		cases: [
			{
				fixture: 'a { top: 15px;\n}',
				expected: 'a { top: 15px;\n}',
			},
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n top: 15px;\n}',
			},
			{
				fixture: 'a {\r\n top: 15px;\r\n}',
				expected: 'a {\r\n top: 15px;\r\n}',
			},
			{
				fixture: 'a {\n top: 15px; bottom: 5px;\n}',
				expected: 'a {\n top: 15px; bottom: 5px;\n}',
			},
			{
				fixture: 'a {\n top: 15px; \n bottom: 5px; }',
				expected: 'a {\n top: 15px; \n bottom: 5px; }',
			},
			{
				fixture: 'a {\n/* comment */ \n top3: 15px; \n\n }',
				expected: 'a {\n/* comment */ \n top3: 15px; \n\n }',
			},
			{
				fixture: 'a{\n --custom-prop: value;\n top: 15px;}',
				expected: 'a{\n --custom-prop: value;\n top: 15px;}',
			},
			{
				fixture: 'a{\n @extends .class;\n top: 15px;}',
				expected: 'a{\n @extends .class;\n top: 15px;}',
			},
			{
				fixture: 'a{\n $var: 15px;\n top: 15px;}',
				expected: 'a{\n $var: 15px;\n top: 15px;}',
			},
			{
				fixture: 'a {\n\n top: 15px;\n}',
				expected: 'a {\n top: 15px;\n}',
			},
			{
				fixture: 'a {\r\n\r\n top: 15px;\r\n}',
				expected: 'a {\r\n top: 15px;\r\n}',
			},
			{
				fixture: 'a{\n bottom: 5px;\n\n top: 15px;}',
				expected: 'a{\n bottom: 5px;\n top: 15px;}',
			},
			{
				fixture: 'a{\n --custom-prop: value;\n\n top: 15px;}',
				expected: 'a{\n --custom-prop: value;\n top: 15px;}',
			},
			{
				fixture: 'a{\n @extends .class;\n\r\n top: 15px;}',
				expected: 'a{\n @extends .class;\n top: 15px;}',
			},
			{
				fixture: 'a{\n $var: 15px;\n\n top: 15px;}',
				expected: 'a{\n $var: 15px;\n top: 15px;}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [false, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
			{
				fixture: 'a {\n\n top: 15px;\n bottom: 5px;}',
				expected: 'a {\n\n top: 15px;\n bottom: 5px;}',
			},
			{
				fixture: 'a {\r\n\r\n top: 15px;\r\n}',
				expected: 'a {\r\n\r\n top: 15px;\r\n}',
			},
			{
				fixture: 'a {\n\n top: 15px;\n\nbottom:5px; }',
				expected: 'a {\n\n top: 15px;\nbottom:5px; }',
			},
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n\n top: 15px;\n}',
			},
			{
				fixture: 'a {\r\n top: 15px;\r\n}',
				expected: 'a {\n\r\n top: 15px;\r\n}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [false, { except: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n top: 15px;\n}',
			},
			{
				fixture: 'a {/* I am a comment */ \n\n bottom: 5px;}',
				expected: 'a {/* I am a comment */ \n bottom: 5px;}',
			},
			{
				fixture: 'a {/* I am a comment */ \r\n\r\n bottom: 5px;}',
				expected: 'a {/* I am a comment */ \r\n bottom: 5px;}',
			},
			{
				fixture: 'a {\n/* I am a comment */ \n\n bottom: 5px;\n\ntop: 15px;}',
				expected: 'a {\n/* I am a comment */ \n\n bottom: 5px;\ntop: 15px;}',
			},
			{
				fixture: 'a {\n top: 15px;\n /* I am a comment */ \n bottom: 5px;}',
				expected: 'a {\n top: 15px;\n /* I am a comment */\n \n bottom: 5px;}',
			},
			{
				fixture: 'a {\n /* I am a comment */ \r\n bottom: 5px;}',
				expected: 'a {\n /* I am a comment */\n \r\n bottom: 5px;}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [false, { except: ['after-declaration'] }]
		},
		cases: [
			{
				fixture: 'a {\n top: 15px;\n}',
				expected: 'a {\n top: 15px;\n}',
			},
			{
				fixture: 'a {\n top:15px; \n\n bottom: 5px;}',
				expected: 'a {\n top:15px; \n\n bottom: 5px;}',
			},
			{
				fixture: 'a {\n top:15px; \r\n\r\n bottom: 5px;}',
				expected: 'a {\n top:15px; \r\n\r\n bottom: 5px;}',
			},
			{
				fixture: 'a {\n\n top:15px;\n\nbottom: 5px;}',
				expected: 'a {\n top:15px;\n\nbottom: 5px;}',
			},
			{
				fixture: 'a {\n top:15px;\nbottom: 5px;}',
				expected: 'a {\n top:15px;\n\nbottom: 5px;}',
			},
			{
				fixture: 'a {\n top: 15px;\n bottom: 5px;}',
				expected: 'a {\n top: 15px;\n\n bottom: 5px;}',
			},
		],
	},
	{
		options: {
			'declaration-empty-line-before': [false, { except: ['first-nested', 'after-comment', 'after-declaration'] }]
		},
		cases: [
			{
				fixture: `a {\n\n top: 15px; \n\n bottom: 5px; \n /* comment */ \n\n prop: 15px;\n\n @extends 'x';\n prop: 15px; \n & b {\n\n prop: 15px;\n } \n prop: 15px; \n }`,
				expected: `a {\n\n top: 15px; \n\n bottom: 5px; \n /* comment */ \n\n prop: 15px;\n\n @extends 'x';\n prop: 15px; \n & b {\n\n prop: 15px;\n } \n prop: 15px; \n }`,
			},
		],
	},
]);
