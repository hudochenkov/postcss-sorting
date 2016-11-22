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

let config;

config = {
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
	`Should not remove first comment in the rule if it's not on separate line`,
	(t) => run(t, 'first-comment-in-the-rule', config)
);

test(
	'Should not remove last comments in the rule',
	(t) => run(t, 'last-comments', config)
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
