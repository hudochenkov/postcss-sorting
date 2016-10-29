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

test(
	'Should be in expected order in case properties are not grouped',
	(t) => run(t, 'single-group', { 'sort-order': ['position', 'z-index'] })
);

test(
	'Should be in expected order in case of multiple groups',
	(t) => run(t, 'multiple-groups', { 'sort-order': [
		['position', 'z-index'],
		['width', 'height']
	] })
);

test(
	'Should work correctly with one comment in case of 1 group',
	(t) => run(t, 'single-group-comment', { 'sort-order': [
		['border-bottom', 'font-style']
	] })
);

test(
	'Should work correctly with comments in case of 1 group',
	(t) => run(t, 'single-group-comments', { 'sort-order': [
		['border-bottom', 'font-style']
	] })
);

test(
	'Should not remove comments in rules if they are only children',
	(t) => run(t, 'rules-with-comments-only')
);

test(
	'Should not remove first comment in the rule if it\'s not on separate line',
	(t) => run(t, 'first-comment-in-the-rule')
);

test.skip(
	'Should not remove last comments in the rule',
	(t) => run(t, 'last-comments')
);

test.skip(
	'Should work correctly with one comment in case of 1 group. SCSS syntax',
	(t) => run(t, 'single-group-comment-scss.scss', { 'sort-order': [
		['border-bottom', 'font-style']
	] }, 'scss')
);

test.skip(
	'Should work correctly with comments in case of 1 group. SCSS syntax',
	(t) => run(t, 'single-group-comments-scss.scss', { 'sort-order': [
		['border-bottom', 'font-style']
	] }, 'scss')
);

test(
	'Should place the leftovers in the end',
	(t) => run(t, 'leftovers-1', { 'sort-order': [
		['font'],
		['position', 'z-index'],
		['display']
	] })
);

test(
	'Should place the leftovers in the beginning',
	(t) => run(t, 'leftovers-2', { 'sort-order': [
		['...'],
		['font'],
		['position', 'z-index'],
		['display']
	] })
);

test(
	'Should place the leftovers in the beginning of its group',
	(t) => run(t, 'leftovers-3', { 'sort-order': [
		['font'],
		['...', 'position', 'z-index'],
		['display']
	] })
);

test(
	'Should place the leftovers in the middle of its group',
	(t) => run(t, 'leftovers-4', { 'sort-order': [
		['font'],
		['position', '...', 'z-index'],
		['display']
	] })
);

test(
	'Should sort properties inside nested rules',
	(t) => run(t, 'nested-rule-1', { 'sort-order': [
		['top', 'color']
	] })
);

test(
	'Should sort properties divided by nested rules',
	(t) => run(t, 'nested-rule-2', { 'sort-order': [
		['top', 'left', 'color']
	] })
);

test(
	'Should sort variables',
	(t) => run(t, 'variable', { 'sort-order': [
		['$variable', '...']
	] })
);

test(
	'Should sort properties inside at-rules',
	(t) => run(t, 'at-rules', { 'sort-order': [
		['top', 'color']
	] })
);

test(
	'Should sort complex case with leftovers',
	(t) => run(t, 'complex-1', { 'sort-order': [
		['$variable'],
		['position'],
		['...', 'border'],
		['@mixin'],
		['font']
	] })
);

test(
	'Should sort at-rules by their parameter name',
	(t) => run(t, 'at-rules-by-parameter', { 'sort-order': [
		[
			'@mixin',
			'border',
			'@some-rule hello',
			'@include media(">=palm")',
			'@mixin clearfix'
		]
	] })
);

test(
	'Should sort at-rules by their parameter name and argument',
	(t) => run(t, 'at-rules-by-parameter-with-arg', { 'sort-order': [
		[
			'@mixin',
			'border',
			'@include mwp(1)',
			'@include media("<=desk")',
			'@include mwp(2)',
			'@include mwp(3)',
			'@include mwp(some-name)'
		]
	] })
);

test(
	'Should preserve indentation',
	(t) => run(t, 'indent', { 'sort-order': [
		['...'],
		['>child'],
		['@media']
	] })
);

test(
	'Should place nested rules at the end of parent rule',
	(t) => run(t, 'nested-rules', { 'sort-order': [
		['...'],
		['>child']
	] })
);

test(
	'Should sort at-rules regardless its name',
	(t) => run(t, 'at-rules-2', { 'sort-order': [
		['@atrule'],
		['...']
	] })
);

test(
	'Should sort at-rules by name',
	(t) => run(t, 'at-rules-by-name', { 'sort-order': [
		['@mixin'],
		['@custom-media'],
		['@some-rule']
	] })
);

test.skip(
	'Should use default config if config is empty',
	(t) => run(t, 'without-specified-config', null)
);

test.skip(
	'Should use default config if config isn\'t an object',
	(t) => run(t, 'without-specified-config', 'config')
);

test(
	'Should sort prefixed propertyes as unprefixed if first one not in order, but second one in',
	(t) => run(t, 'prefixed', { 'sort-order': [
		'position',
		'-webkit-box-sizing',
		'box-sizing',
		'width'
	] })
);

test(
	'Should insert empty lines between children classes in accordance with option \'empty-lines-between-children-rules\'',
	(t) => run(t, 'lines-between-children', {
		'sort-order': [
			['...'],
			['>child']
		],
		'empty-lines-between-children-rules': 2
	})
);

test(
	'Should insert empty lines between @media rules in accordance with option \'empty-lines-between-media-rules\'',
	(t) => run(t, 'lines-between-media', {
		'sort-order': [
			['...'],
			['@media']
		],
		'empty-lines-between-media-rules': 2
	})
);

test(
	'Should not insert additional line between @media and children rules if they have empty lines inside group',
	(t) => run(t, 'lines-between-rules-issue-19', {
		'sort-order': [
			['@mixin'],
			['...'],
			['@media'],
			['>child']
		],
		'empty-lines-between-children-rules': 1,
		'empty-lines-between-media-rules': 1
	})
);

test(
	'Should preserve empty lines between children rules',
	(t) => run(t, 'preserve-empty-lines-between-children', {
		'preserve-empty-lines-between-children-rules': true
	})
);

test(
	'Should preserve empty lines between children rules and don\'t create unneeded empty lines if \'empty-lines-between-children-rules\' enabled',
	(t) => run(t, 'preserve-empty-lines-between-children-2', {
		'empty-lines-between-children-rules': 1,
		'preserve-empty-lines-between-children-rules': true
	})
);

test(
	'Should not fail if getApplicableNode() receive no node. Issue #21',
	(t) => run(t, 'issue-21', {
		'empty-lines-between-children-rules': 1
	})
);

test.skip(
	'Should add empty lines before comment',
	(t) => run(t, 'empty-lines-before-comment', {
		'empty-lines-before-comment': 2
	})
);

test.skip(
	'Should add empty lines after comment',
	(t) => run(t, 'empty-lines-after-comment', {
		'empty-lines-after-comment': 2
	})
);

test(
	'Should disable/enable sorting by special comments',
	(t) => run(t, 'sorting-disabling', {
		'sort-order': [
			[
				'display',
				'width'
			],
			[
				'>child'
			]
		]
	})
);
