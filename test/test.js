import postcss from 'postcss';
import test from 'ava';
import fs from 'fs';
import path from 'path';
import plugin from '../';

function run(t, input, opts = { }, syntax) {
	var dir = './fixtures/';
	var inputName = input;
	var inputExt = 'css';
	var inputSplitted = input.split('.');

	if (inputSplitted.length > 1) {
		inputName = inputSplitted[0];
		inputExt = inputSplitted[1];
	}

	var inputPath = path.resolve(dir + inputName + '.' + inputExt);
	var expectPath = path.resolve(dir + inputName + '.expected.' + inputExt);
	var actualPath = path.resolve(dir + inputName + '.actual.' + inputExt);

	var inputCSS = fs.readFileSync(inputPath, 'utf8');
	var expectCSS = fs.readFileSync(expectPath, 'utf8');

	if (syntax) {
		if (syntax === 'scss') {
			syntax = { syntax: require('postcss-scss') };
		} else if (syntax === 'less') {
			syntax = { syntax: require('postcss-less') };
		}
	} else {
		syntax = {};
	}

	return postcss([plugin(opts)]).process(inputCSS, syntax)
		.then(result => {
			var actualCSS = result.css;

			fs.writeFileSync(actualPath, actualCSS);

			t.same(result.css, expectCSS);
			t.same(result.warnings().length, 0);
		});
}

test('Should be in expected order in case properties are not grouped', t => {
	return run(t, 'single-group', { 'sort-order': ['position', 'z-index'] });
});

test('Should be in expected order in case of multiple groups', t => {
	return run(t, 'multiple-groups', { 'sort-order': [
		['position', 'z-index'],
		['width', 'height']
	] });
});

test('Should work correctly with one comment in case of 1 group', t => {
	return run(t, 'single-group-comment', { 'sort-order': [
		['border-bottom', 'font-style']
	] });
});

test('Should work correctly with comments in case of 1 group', t => {
	return run(t, 'single-group-comments', { 'sort-order': [
		['border-bottom', 'font-style']
	] });
});

test('Should not remove comments in rules if they are only children', t => {
	return run(t, 'rules-with-comments-only');
});

test('Should not remove first comment in the rule if it\'s not on separate line', t => {
	return run(t, 'first-comment-in-the-rule');
});

test('Should not remove last comments in the rule', t => {
	return run(t, 'last-comments');
});

test('Should work correctly with one comment in case of 1 group. SCSS syntax', t => {
	return run(t, 'single-group-comment-scss.scss', { 'sort-order': [
		['border-bottom', 'font-style']
	] }, 'scss');
});

test('Should work correctly with comments in case of 1 group. SCSS syntax', t => {
	return run(t, 'single-group-comments-scss.scss', { 'sort-order': [
		['border-bottom', 'font-style']
	] }, 'scss');
});

test('Should place the leftovers in the end', t => {
	return run(t, 'leftovers-1', { 'sort-order': [
		['font'],
		['position', 'z-index'],
		['display']
	] });
});

test('Should place the leftovers in the beginning', t => {
	return run(t, 'leftovers-2', { 'sort-order': [
		['...'],
		['font'],
		['position', 'z-index'],
		['display']
	] });
});

test('Should place the leftovers in the beginning of its group', t => {
	return run(t, 'leftovers-3', { 'sort-order': [
		['font'],
		['...', 'position', 'z-index'],
		['display']
	] });
});

test('Should place the leftovers in the middle of its group', t => {
	return run(t, 'leftovers-4', { 'sort-order': [
		['font'],
		['position', '...', 'z-index'],
		['display']
	] });
});

test('Should sort properties inside nested rules', t => {
	return run(t, 'nested-rule-1', { 'sort-order': [
		['top', 'color']
	] });
});

test('Should sort properties divided by nested rules', t => {
	return run(t, 'nested-rule-2', { 'sort-order': [
		['top', 'left', 'color']
	] });
});

test('Should sort variables', t => {
	return run(t, 'variable', { 'sort-order': [
		['$variable', '...']
	] });
});

test('Should sort properties inside at-rules', t => {
	return run(t, 'at-rules', { 'sort-order': [
		['top', 'color']
	] });
});

test('Should sort complex case with leftovers', t => {
	return run(t, 'complex-1', { 'sort-order': [
		['$variable'],
		['position'],
		['...', 'border'],
		['@mixin'],
		['font']
	] });
});

test('Should sort at-rules by their parameter name', t => {
	return run(t, 'at-rules-by-parameter', { 'sort-order': [
		['@mixin', 'border', '@some-rule hello', '@mixin clearfix']
	] });
});

test('Should sort at-rules by their parameter name and argument', t => {
	return run(t, 'at-rules-by-parameter-with-arg', { 'sort-order': [
		['@mixin', 'border', '@include mwp(1)', '@include mwp(2)', '@include mwp(3)']
	] });
});

test('Should preserve indentation', t => {
	return run(t, 'indent', { 'sort-order': [
		['...'],
		['>child'],
		['@media']
	] });
});

test('Should place nested rules at the end of parent rule', t => {
	return run(t, 'nested-rules', { 'sort-order': [
		['...'],
		['>child']
	] });
});

test('Should sort at-rules regardless its name', t => {
	return run(t, 'at-rules-2', { 'sort-order': [
		['@atrule'],
		['...']
	] });
});

test('Should sort at-rules by name', t => {
	return run(t, 'at-rules-by-name', { 'sort-order': [
		['@mixin'],
		['@custom-media'],
		['@some-rule']
	] });
});

test('Should use default config if config is empty', t => {
	return run(t, 'without-specified-config');
});

test('Should sort prefixed propertyes as unprefixed if first one not in order, but second one in', t => {
	return run(t, 'prefixed', { 'sort-order': [
		'position',
		'-webkit-box-sizing',
		'box-sizing',
		'width'
	] });
});

test('Should insert empty lines between children classes in accordance with option \'empty-lines-between-children-rules\'', t => {
	return run(t, 'lines-between-children', {
		'sort-order': [
			['...'],
			['>child']
		],
		'empty-lines-between-children-rules': 2
	});
});

test('Should insert empty lines between @media rules in accordance with option \'empty-lines-between-media-rules\'', t => {
	return run(t, 'lines-between-media', {
		'sort-order': [
			['...'],
			['@media']
		],
		'empty-lines-between-media-rules': 2
	});
});

test('Should not insert additional line between @media and children rules if they have empty lines inside group', t => {
	return run(t, 'lines-between-rules-issue-19', {
		'sort-order': [
			['@mixin'],
			['...'],
			['@media'],
			['>child']
		],
		'empty-lines-between-children-rules': 1,
		'empty-lines-between-media-rules': 1
	});
});

test('Should preserve empty lines between children rules', t => {
	return run(t, 'preserve-empty-lines-between-children', {
		'preserve-empty-lines-between-children-rules': true
	});
});

test('Should preserve empty lines between children rules and don\'t create unneeded empty lines if \'empty-lines-between-children-rules\' enabled', t => {
	return run(t, 'preserve-empty-lines-between-children-2', {
		'empty-lines-between-children-rules': 1,
		'preserve-empty-lines-between-children-rules': true
	});
});

test('Should not fail if getApplicableNode() receive no node. Issue #21', t => {
	return run(t, 'issue-21', {
		'empty-lines-between-children-rules': 1
	});
});

test('Should add empty lines before comment', t => {
	return run(t, 'empty-lines-before-comment', {
		'empty-lines-before-comment': 2
	});
});

test('Should add empty lines after comment', t => {
	return run(t, 'empty-lines-after-comment', {
		'empty-lines-after-comment': 2
	});
});

test('Should disable/enable sorting by special comments', t => {
	return run(t, 'sorting-disabling', {
		'sort-order': [
			[
				'display',
				'width'
			],
			[
				'>child'
			]
		]
	});
});

// test('Should sort LESS files', t => {
//     return run(t, 'less.less', {}, 'less');
// });
