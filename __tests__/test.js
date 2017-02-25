'use strict';

const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const plugin = require('../');

function run(input, opts) {
	const dir = path.join(__dirname, './fixtures/');
	const inputSplitted = input.split('.');
	let inputName = input;
	let inputExt = 'css';

	if (inputSplitted.length > 1) {
		inputName = inputSplitted[0];
		inputExt = inputSplitted[1];
	}

	const inputPath = path.resolve(`${dir + inputName}.${inputExt}`);
	const expectPath = path.resolve(`${dir + inputName}.expected.${inputExt}`);
	const actualPath = path.resolve(`${dir + inputName}.actual.${inputExt}`);

	let inputCSS = '';
	let expectCSS = '';

	try {
		inputCSS = fs.readFileSync(inputPath, 'utf8');
	} catch (error) {
		fs.writeFileSync(inputPath, inputCSS);
	}

	try {
		expectCSS = fs.readFileSync(expectPath, 'utf8');
	} catch (error) {
		fs.writeFileSync(expectPath, expectCSS);
	}

	return postcss([plugin(opts)]).process(inputCSS)
		.then((result) => {
			const actualCSS = result.css;

			fs.writeFileSync(actualPath, actualCSS);

			expect(result.css).toEqual(expectCSS);
			expect(result.warnings().length).toEqual(0);
		});
}

test(
	`Should do nothing if config is undefined`,
	() => run('empty-lines-preserve')
);

const config = {
	order: [
		'declarations',
		'rules',
	],
};

test(
	'Should not remove comments in rules if they are only children',
	() => run('rules-with-comments-only', config)
);

test(
	`Should not remove first comment in the rule if it's not on separate line (order)`,
	() => run('first-comment-in-the-rule', config)
);

test(
	'Should not remove last comments in the rule',
	() => run('last-comments', config)
);

test(
	'Should assign comments before and after nodes correctly (order)',
	() => run('nodes-comments.css',
		{
			order: [
				'custom-properties',
				'dollar-variables',
				'declarations',
			],
		}
	)
);

test(
	'Should sort by keywords',
	() => run('keywords',
		{
			order: [
				'custom-properties',
				'dollar-variables',
				'declarations',
				'rules',
				'at-rules',
			],
		}
	)
);

test(
	'At-rules combination from most specified to least specified',
	() => run('at-rules',
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
		}
	)
);

test(
	'At-rules mixed combination',
	() => run('at-rules-mixed',
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
		}
	)
);

test(
	'Should sort inside nested rules',
	() => run('nested-rule',
		{
			order: [
				'custom-properties',
				'declarations',
				'rules',
			],
		}
	)
);

test(
	'Should sort inside nested at-rules',
	() => run('nested-at-rule',
		{
			order: [
				'custom-properties',
				'declarations',
				'at-rules',
			],
		}
	)
);

test(
	'Should move unspecified nodes to the bottom',
	() => run('unspecified-nodes',
		{
			order: [
				'custom-properties',
				'declarations',
			],
		}
	)
);

test(
	'Should preserve indentation',
	() => run('indent',
		{
			order: [
				'declarations',
				'rules',
				'at-rules',
			],
		}
	)
);

test(
	'Should sort properties (array config)',
	() => run('properties-simple',
		{
			'properties-order': [
				'position',
				'top',
				'display',
				'z-index',
			],
		}
	)
);

test(
	'Should sort properties (array of objects config)',
	() => run('properties-simple',
		{
			'properties-order': [
				{
					properties: [
						'position',
						'top',
					],
				},
				{
					properties: [
						'display',
						'z-index',
					],
				},
			],
		}
	)
);

test(
	'Should sort prefixed properties before unprefixed property',
	() => run('prefixed',
		{
			'properties-order': [
				'position',
				'-webkit-box-sizing',
				'box-sizing',
				'width',
			],
		}
	)
);

test(
	'Should assign comments before and after declarations correctly (properties-order)',
	() => run('properties-comments',
		{
			'properties-order': [
				'border-bottom',
				'font-style',
			],
		}
	)
);

test(
	'Should place the leftovers properties in the end (not specified)',
	() => run('leftover-properties-bottom',
		{
			'properties-order': [
				'position',
				'z-index',
			],
		}
	)
);

test(
	'Should place the leftovers properties in the end (bottom)',
	() => run('leftover-properties-bottom',
		{
			'properties-order': [
				'position',
				'z-index',
			],
			'unspecified-properties-position': 'bottom',
		}
	)
);

test(
	'Should place the leftovers properties in the beginning (top)',
	() => run('leftover-properties-top',
		{
			'properties-order': [
				'position',
				'z-index',
			],
			'unspecified-properties-position': 'top',
		}
	)
);

test(
	'Should place the leftovers properties in the end (bottomAlphabetical)',
	() => run('leftover-properties-bottom-alphabetical',
		{
			'properties-order': [
				'position',
				'z-index',
			],
			'unspecified-properties-position': 'bottomAlphabetical',
		}
	)
);

test(
	'Should preserve order if properties have same name',
	() => run('properties-have-same-name',
		{
			'properties-order': [
				'position',
				'z-index',
			],
		}
	)
);

test(
	`Should not remove first comment in the rule if it's not on separate line (properties-order)`,
	() => run('first-comment-in-the-rule',
		{
			'properties-order': [
				'display',
			],
		}
	)
);

test(
	`Should sort declarations grouped together between not declarations (without comments)`,
	() => run('properties-grouped-together',
		{
			'properties-order': [
				'display',
				'position',
			],
		}
	)
);

test(
	`Should sort declarations grouped together between not declarations (with comments)`,
	() => run('properties-grouped-together-comments',
		{
			'properties-order': [
				'display',
				'position',
			],
		}
	)
);

test(
	`Should sort declarations scattered everywhere (without comments)`,
	() => run('properties-scattered',
		{
			'properties-order': [
				'display',
				'position',
			],
		}
	)
);

test(
	`Should sort declarations scattered everywhere (with comments)`,
	() => run('properties-scattered-comments',
		{
			'properties-order': [
				'display',
				'position',
			],
		}
	)
);

test(
	'Should sort properties alphabetically',
	() => run('properties-simple-alphabetical',
		{
			'properties-order': 'alphabetical',
		}
	)
);

test(
	'Should sort prefixed properties before unprefixed property in alphabetical order',
	() => run('prefixed-alphabetical',
		{
			'properties-order': 'alphabetical',
		}
	)
);

test(
	'Should assign comments before and after declarations correctly (properties-order, alphabetical)',
	() => run('properties-comments-alphabetical',
		{
			'properties-order': 'alphabetical',
		}
	)
);

test(
	'Should remove empty lines',
	() => run('empty-lines-remove',
		{
			'clean-empty-lines': true,
		}
	)
);

test(
	`Shouldn't mess with line breaks`,
	() => run('empty-lines-preserve',
		{
			'clean-empty-lines': true,
		}
	)
);

test(
	'Should add empty lines between declaration groups',
	() => run('properties-groups-empty-line',
		{
			'properties-order': [
				{
					emptyLineBefore: true,
					properties: [
						'position',
						'top',
					],
				},
				{
					emptyLineBefore: true,
					properties: [
						'display',
						'z-index',
					],
				},
			],
		}
	)
);

test(
	`Shouldn't add empty lines between declaration groups`,
	() => run('properties-groups-preserve-empty-line',
		{
			'properties-order': [
				{
					properties: [
						'position',
						'top',
					],
				},
				{
					properties: [
						'display',
						'z-index',
					],
				},
			],
		}
	)
);

test(
	`Shouldn't add empty lines between declaration groups`,
	() => run('properties-groups-remove-empty-line',
		{
			'properties-order': [
				{
					emptyLineBefore: false,
					properties: [
						'position',
						'top',
					],
				},
				{
					emptyLineBefore: false,
					properties: [
						'display',
						'z-index',
					],
				},
			],
		}
	)
);
