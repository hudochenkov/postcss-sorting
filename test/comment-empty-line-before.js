import groupTest from './_group-test';

function mergeTestCases(first, second) {
	return first.concat(second);
}

const sharedAlwaysTests = [
	{
		fixture: 'a { color: pink; /** comment */\ntop: 0; }',
		expected: 'a { color: pink; /** comment */\ntop: 0; }',
	},
	{
		fixture: 'a {/** comment */}',
		expected: 'a {/** comment */}',
	},
	{
		fixture: 'a {color: pink;\n\n/** comment */}',
		expected: 'a {color: pink;\n\n/** comment */}',
	},
	{
		fixture: 'a {color: pink;\r\n\r\n/** comment */}',
		expected: 'a {color: pink;\r\n\r\n/** comment */}',
	},
	{
		fixture: 'a {color: pink;\n\r\n/** comment */}',
		expected: 'a {color: pink;\n\r\n/** comment */}',
	},
	{
		fixture: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
		expected: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
	},
	{
		fixture: 'a{/** comment */\n/** comment */}',
		expected: 'a{/** comment */\n\n/** comment */}',
	},
	{
		fixture: 'a{/** comment */\r\n/** comment */}',
		expected: 'a{/** comment */\n\r\n/** comment */}',
	},
	{
		fixture: 'a { color: pink;\n/** comment */\ntop: 0; }',
		expected: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
	},
	{
		fixture: 'a { color: pink;\r\n/** comment */\r\ntop: 0; }',
		expected: 'a { color: pink;\n\r\n/** comment */\r\ntop: 0; }',
	},
];

groupTest([
	{
		options: {
			'comment-empty-line-before': true
		},
		cases: mergeTestCases(sharedAlwaysTests, [
			{
				fixture: 'a {\n\n  /* comment */\n  color: pink;\n}',
				expected: 'a {\n\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested with empty line before',
			},
			{
				fixture: 'a {\n  /* comment */\n  color: pink;\n}',
				expected: 'a {\n\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested without empty line before',
			},
		]),
	},
	{
		options: {
			'comment-empty-line-before': [true, { except: ['first-nested'] }]
		},
		cases: mergeTestCases(sharedAlwaysTests, [
			{
				fixture: 'a {\n  /* comment */\n  color: pink;\n}',
				expected: 'a {\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested without empty line before',
			},
			{
				fixture: 'a {\n\n  /* comment */\n  color: pink;\n}',
				expected: 'a {\n  /* comment */\n  color: pink;\n}',
				description: 'first-nested with empty line before',
			},
		]),
	},
	{
		options: {
			'comment-empty-line-before': [true, { ignore: ['stylelint-command'] }]
		},
		cases: mergeTestCases(sharedAlwaysTests, [
			{
				fixture: 'a {\ncolor: pink;\n/* stylelint-disable something */\ntop: 0;\n}',
				expected: 'a {\ncolor: pink;\n/* stylelint-disable something */\ntop: 0;\n}',
				description: 'no newline before a stylelint command comment',
			},
		]),
	},
	{
		options: {
			'comment-empty-line-before': [true, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: '/* a */\n/* b */\n/* c */\nbody {\n}',
				expected: '/* a */\n/* b */\n/* c */\nbody {\n}',
				description: 'no newline between comments',
			},
			{
				fixture: 'a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }',
				expected: 'a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }',
				description: 'no newline between comments',
			},
			{
				fixture: 'a { color: pink;\n/** comment */\n/** comment */\ntop: 0; }',
				expected: 'a { color: pink;\n\n/** comment */\n/** comment */\ntop: 0; }',
			},
		],
	},
	{
		options: {
			'comment-empty-line-before': [false]
		},
		cases: [
			{
				fixture: 'a { color: pink; /** comment */\ntop: 0; }',
				expected: 'a { color: pink; /** comment */\ntop: 0; }',
				description: 'shared-line comment ignored',
			},
			{
				fixture: 'a {} /** comment */',
				expected: 'a {} /** comment */',
			},
			{
				fixture: 'a { color: pink;\n/** comment */\n\ntop: 0; }',
				expected: 'a { color: pink;\n/** comment */\n\ntop: 0; }',
			},
			{
				fixture: 'a { color: pink;\r\n/** comment */\r\n\r\ntop: 0; }',
				expected: 'a { color: pink;\r\n/** comment */\r\n\r\ntop: 0; }',
			},
			{
				fixture: 'a{/** comment */\n\n/** comment */}',
				expected: 'a{/** comment */\n/** comment */}',
			},
			{
				fixture: 'a {\n\n\n/** comment */}',
				expected: 'a {\n/** comment */}',
			},
			{
				fixture: 'a {\r\n\r\n\r\n/** comment */}',
				expected: 'a {\r\n/** comment */}',
			},
			{
				fixture: 'a { color: pink;\n\n/** comment */\ntop: 0; }',
				expected: 'a { color: pink;\n/** comment */\ntop: 0; }',
			},
		],
	},
]);
