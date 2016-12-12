import postcss from 'postcss';
import test from 'ava';
import fs from 'fs';
import path from 'path';
import plugin from '../';

function run(t, input, opts = {}) {
	const dir = './fixtures/';
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

			t.deepEqual(result.css, expectCSS);
			t.deepEqual(result.warnings().length, 0);
		});
}

const config = {
	order: [
		'declarations',
		'rules',
	],
};

test(
	'Should not remove comments in rules if they are only children',
	(t) => run(t, 'rules-with-comments-only', config)
);

test(
	`Should not remove first comment in the rule if it's not on separate line (order)`,
	(t) => run(t, 'first-comment-in-the-rule', config)
);

test(
	'Should not remove last comments in the rule',
	(t) => run(t, 'last-comments', config)
);

test(
	'Should assign comments before and after nodes correctly (order)',
	(t) => run(t, 'nodes-comments.css',
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
	(t) => run(t, 'keywords',
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
	(t) => run(t, 'at-rules',
		{
			order: [
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
					hasBlock: true
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media'
				},
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true
				},
				{
					type: 'at-rule',
					name: 'include',
				},
				{
					type: 'at-rule',
					hasBlock: true
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
	(t) => run(t, 'at-rules-mixed',
		{
			order: [
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true
				},
				{
					type: 'at-rule',
					name: 'include',
				},
				{
					type: 'at-rule',
					hasBlock: true
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media'
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
					hasBlock: true
				},
			],
		}
	)
);

test(
	'Should sort inside nested rules',
	(t) => run(t, 'nested-rule',
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
	(t) => run(t, 'nested-at-rule',
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
	(t) => run(t, 'unspecified-nodes',
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
	(t) => run(t, 'indent',
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
	(t) => run(t, 'properties-simple',
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
	(t) => run(t, 'properties-simple',
		{
			'properties-order': [
				{
					properties: [
						'position',
						'top',
					]
				},
				{
					properties: [
						'display',
						'z-index',
					]
				},
			],
		}
	)
);

test(
	'Should sort prefixed properties before unprefixed property',
	(t) => run(t, 'prefixed',
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
	(t) => run(t, 'properties-comments',
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
	(t) => run(t, 'leftover-properties-bottom',
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
	(t) => run(t, 'leftover-properties-bottom',
		{
			'properties-order': [
				'position',
				'z-index',
			],
			'unspecified-properties-position': 'bottom'
		}
	)
);

test(
	'Should place the leftovers properties in the beginning (top)',
	(t) => run(t, 'leftover-properties-top',
		{
			'properties-order': [
				'position',
				'z-index',
			],
			'unspecified-properties-position': 'top'
		}
	)
);

test(
	'Should place the leftovers properties in the end (bottomAlphabetical)',
	(t) => run(t, 'leftover-properties-bottom-alphabetical',
		{
			'properties-order': [
				'position',
				'z-index',
			],
			'unspecified-properties-position': 'bottomAlphabetical'
		}
	)
);

test(
	'Should preserve order if properties have same name',
	(t) => run(t, 'properties-have-same-name',
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
	(t) => run(t, 'first-comment-in-the-rule',
		{
			'properties-order': [
				'display',
			],
		}
	)
);

test(
	`Should sort declarations grouped together between not declarations (without comments)`,
	(t) => run(t, 'properties-grouped-together',
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
	(t) => run(t, 'properties-grouped-together-comments',
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
	(t) => run(t, 'properties-scattered',
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
	(t) => run(t, 'properties-scattered-comments',
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
	(t) => run(t, 'properties-simple-alphabetical',
		{
			'properties-order': 'alphabetical',
		}
	)
);

test(
	'Should sort prefixed properties before unprefixed property in alphabetical order',
	(t) => run(t, 'prefixed-alphabetical',
		{
			'properties-order': 'alphabetical',
		}
	)
);

test(
	'Should assign comments before and after declarations correctly (properties-order, alphabetical)',
	(t) => run(t, 'properties-comments-alphabetical',
		{
			'properties-order': 'alphabetical',
		}
	)
);

test(
	'Should remove empty lines',
	(t) => run(t, 'empty-lines-remove',
		{
			'clean-empty-lines': true,
		}
	)
);

test(
	`Shouldn't mess with line breaks`,
	(t) => run(t, 'empty-lines-preserve',
		{
			'clean-empty-lines': true,
		}
	)
);
