'use strict';

const config = {
	order: ['declarations', 'rules'],
};

test('Should not remove comments in rules if they are only children', () =>
	runTest('rules-with-comments-only', config, __dirname));

test(`Should not remove first comment in the rule if it's not on separate line (order)`, () =>
	runTest('first-comment-in-the-rule', config, __dirname));

test('Should not remove last comments in the rule', () =>
	runTest('last-comments', config, __dirname));

test('Should assign comments before and after nodes correctly (order)', () =>
	runTest(
		'nodes-comments.css',
		{
			order: ['custom-properties', 'dollar-variables', 'declarations'],
		},
		__dirname
	));

test('Should sort by keywords', () =>
	runTest(
		'keywords',
		{
			order: ['custom-properties', 'dollar-variables', 'declarations', 'rules', 'at-rules'],
		},
		__dirname
	));

test('At-rules combination from most specified to least specified', () =>
	runTest(
		'at-rules',
		{
			order: [
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
				},
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
				},
				{
					type: 'at-rule',
					hasBlock: true,
				},
				{
					type: 'at-rule',
				},
			],
		},
		__dirname
	));

test('At-rules mixed combination', () =>
	runTest(
		'at-rules-mixed',
		{
			order: [
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
				},
				{
					type: 'at-rule',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
					hasBlock: true,
				},
			],
		},
		__dirname
	));

test('Should sort inside nested rules', () =>
	runTest(
		'nested-rule',
		{
			order: ['custom-properties', 'declarations', 'rules'],
		},
		__dirname
	));

test('Should sort inside nested at-rules', () =>
	runTest(
		'nested-at-rule',
		{
			order: ['custom-properties', 'declarations', 'at-rules'],
		},
		__dirname
	));

test('Should move unspecified nodes to the bottom', () =>
	runTest(
		'unspecified-nodes',
		{
			order: ['custom-properties', 'declarations'],
		},
		__dirname
	));

test('Should preserve indentation', () =>
	runTest(
		'indent',
		{
			order: ['declarations', 'rules', 'at-rules'],
		},
		__dirname
	));

groupTest([
	{
		options: {
			order: [
				{
					type: 'rule',
					selector: '^a',
				},
				{
					type: 'rule',
					selector: /^&/,
				},
				{
					type: 'rule',
				},
			],
		},
		cases: [
			{
				description: `doesn't change`,
				fixture: `
					a {
						a {}
						abbr {}
						&:hover {}
						span {}
					}
				`,
				expected: `
					a {
						a {}
						abbr {}
						&:hover {}
						span {}
					}
				`,
			},
			{
				description: `doesn't change`,
				fixture: `
					a {
						abbr {}
						a {}
						&:hover {}
						span {}
					}
				`,
				expected: `
					a {
						abbr {}
						a {}
						&:hover {}
						span {}
					}
				`,
			},
			{
				description: `doesn't change`,
				fixture: `
					a {
						a {}
						span {}
					}
				`,
				expected: `
					a {
						a {}
						span {}
					}
				`,
			},
			{
				fixture: `
					a {
						a {}
						&:hover {}
						abbr {}
						span {}
					}
				`,
				expected: `
					a {
						a {}
						abbr {}
						&:hover {}
						span {}
					}
				`,
			},
			{
				fixture: `
					a {
						span {}
						&:hover {}
					}
				`,
				expected: `
					a {
						&:hover {}
						span {}
					}
				`,
			},
			{
				fixture: `
					a {
						span {}
						abbr {}
					}
				`,
				expected: `
					a {
						abbr {}
						span {}
					}
				`,
			},
		],
	},
	{
		options: {
			order: [
				{
					type: 'rule',
					selector: /^&/,
				},
				{
					type: 'rule',
					selector: /^&:\w/,
				},
				{
					type: 'rule',
				},
			],
		},
		cases: [
			{
				description: `doesn't change`,
				fixture: `
					a {
						&:hover {}
						& b {}
						b & {}
					}
				`,
				expected: `
					a {
						&:hover {}
						& b {}
						b & {}
					}
				`,
			},
			{
				description: `doesn't change`,
				fixture: `
					a {
						& b {}
						&:hover {}
						b & {}
					}
				`,
				expected: `
					a {
						& b {}
						&:hover {}
						b & {}
					}
				`,
			},
			{
				fixture: `
					a {
						& b {}
						b & {}
						&:hover {}
					}
				`,
				expected: `
					a {
						& b {}
						&:hover {}
						b & {}
					}
				`,
			},
			{
				fixture: `
					a {
						&:hover {}
						b & {}
						& b {}
					}
				`,
				expected: `
					a {
						&:hover {}
						& b {}
						b & {}
					}
				`,
			},
		],
	},
	{
		options: {
			order: [
				{
					type: 'rule',
				},
				{
					type: 'rule',
					selector: /^&:\w/,
				},
				{
					type: 'rule',
					selector: /^&/,
				},
			],
		},
		cases: [
			{
				description: `doesn't change`,
				fixture: `
					a {
						b & {}
						&:hover {}
						& b {}
					}
				`,
				expected: `
					a {
						b & {}
						&:hover {}
						& b {}
					}
				`,
			},
			{
				description: `doesn't change`,
				fixture: `
					a {
						b & {}
						& b {}
					}
				`,
				expected: `
					a {
						b & {}
						& b {}
					}
				`,
			},
			{
				fixture: `
					a {
						b & {}
						& b {}
						&:hover {}
					}
				`,
				expected: `
					a {
						b & {}
						&:hover {}
						& b {}
					}
				`,
			},
			{
				fixture: `
					a {
						&:hover {}
						b & {}
					}
				`,
				expected: `
					a {
						b & {}
						&:hover {}
					}
				`,
			},
		],
	},
]);

groupTest([
	{
		options: {
			order: [
				{
					type: 'at-rule',
					hasBlock: false,
				},
				'declarations',
			],
		},
		cases: [
			{
				description: `doesn't change`,
				fixture: `
					a {
						@include hello;
						display: none;
						@include hello {
							display: block;
						}
					}
				`,
				expected: `
					a {
						@include hello;
						display: none;
						@include hello {
							display: block;
						}
					}
				`,
			},
			{
				description: `doesn't change`,
				fixture: `
					a {
						display: none;
						@include hello {
							display: block;
						}
					}
				`,
				expected: `
					a {
						display: none;
						@include hello {
							display: block;
						}
					}
				`,
			},
			{
				fixture: `
					a {
						display: none;
						@include hello;
					}
				`,
				expected: `
					a {
						@include hello;
						display: none;
					}
				`,
			},
			{
				fixture: `
					a {
						@include hello;
						@include hello {
							display: block;
						}
						display: none;
					}
				`,
				expected: `
					a {
						@include hello;
						display: none;
						@include hello {
							display: block;
						}
					}
				`,
			},
			{
				fixture: `
					a {
						@include hello {
							display: block;
						}
						@include hello;
						display: none;
					}
				`,
				expected: `
					a {
						@include hello;
						display: none;
						@include hello {
							display: block;
						}
					}
				`,
			},
		],
	},
]);
