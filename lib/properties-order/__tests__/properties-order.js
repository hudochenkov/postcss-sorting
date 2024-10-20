test('Should sort properties (array config)', () =>
	runTest(
		'properties-simple',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Should sort prefixed properties before unprefixed property', () =>
	runTest(
		'prefixed',
		{
			'properties-order': ['position', '-webkit-box-sizing', 'box-sizing', 'width'],
		},
		__dirname,
	));

test('Should assign comments before and after declarations correctly (properties-order)', () =>
	runTest(
		'properties-comments',
		{
			'properties-order': ['border-bottom', 'font-style'],
		},
		__dirname,
	));

test('Should place the leftovers properties in the end (not specified)', () =>
	runTest(
		'leftover-properties-bottom',
		{
			'properties-order': ['position', 'z-index'],
		},
		__dirname,
	));

test('Should place the leftovers properties in the end (bottom)', () =>
	runTest(
		'leftover-properties-bottom',
		{
			'properties-order': ['position', 'z-index'],
			'unspecified-properties-position': 'bottom',
		},
		__dirname,
	));

test('Should place the leftovers properties in the beginning (top)', () =>
	runTest(
		'leftover-properties-top',
		{
			'properties-order': ['position', 'z-index'],
			'unspecified-properties-position': 'top',
		},
		__dirname,
	));

test('Should place the leftovers properties in the end (bottomAlphabetical)', () =>
	runTest(
		'leftover-properties-bottom-alphabetical',
		{
			'properties-order': ['position', 'z-index'],
			'unspecified-properties-position': 'bottomAlphabetical',
		},
		__dirname,
	));

test('Should preserve order if properties have same name', () =>
	runTest(
		'properties-have-same-name-1',
		{
			'properties-order': ['position', 'z-index'],
		},
		__dirname,
	));

test('Should preserve order if properties have same name', () =>
	runTest(
		'properties-have-same-name-2',
		{
			'properties-order': ['position', 'z-index'],
		},
		__dirname,
	));

test('Should preserve order if properties have same name', () =>
	runTest(
		'properties-have-same-name-3',
		{
			'properties-order': 'alphabetical',
		},
		__dirname,
	));

test('Should preserve order if properties have same name (case insensitive)', () =>
	runTest(
		'properties-have-same-name-4',
		{
			'properties-order': ['position', 'z-index'],
		},
		__dirname,
	));

test('Should preserve order if properties have same name (case insensitive)', () =>
	runTest(
		'properties-have-same-name-5',
		{
			'properties-order': 'alphabetical',
		},
		__dirname,
	));

test(`Should not remove first comment in the rule if it's not on separate line (properties-order)`, () =>
	runTest(
		'first-comment-in-the-rule',
		{
			'properties-order': ['display'],
		},
		__dirname,
	));

test(`Should sort declarations grouped together between not declarations (without comments)`, () =>
	runTest(
		'properties-grouped-together',
		{
			'properties-order': ['display', 'position'],
		},
		__dirname,
	));

test(`Should sort declarations grouped together between not declarations (with comments)`, () =>
	runTest(
		'properties-grouped-together-comments',
		{
			'properties-order': ['display', 'position'],
		},
		__dirname,
	));

test(`Should sort declarations scattered everywhere (without comments)`, () =>
	runTest(
		'properties-scattered',
		{
			'properties-order': ['display', 'position'],
		},
		__dirname,
	));

test(`Should sort declarations scattered everywhere (with comments)`, () =>
	runTest(
		'properties-scattered-comments',
		{
			'properties-order': ['display', 'position'],
		},
		__dirname,
	));

test('Should sort properties alphabetically', () =>
	runTest(
		'properties-simple-alphabetical',
		{
			'properties-order': 'alphabetical',
		},
		__dirname,
	));

test('Should sort properties alphabetically regardless of case', () => {
	runTest(
		'properties-alphabetical-case-insensitive',
		{
			'properties-order': 'alphabetical',
		},
		__dirname,
	);
});

test('Should sort shorthand properties before their longhand versions', () =>
	runTest(
		'properties-alphabetical-shorthand',
		{
			'properties-order': 'alphabetical',
		},
		__dirname,
	));

test('Should sort prefixed properties before unprefixed property in alphabetical order', () =>
	runTest(
		'prefixed-alphabetical',
		{
			'properties-order': 'alphabetical',
		},
		__dirname,
	));

test('Should assign comments before and after declarations correctly (properties-order, alphabetical)', () =>
	runTest(
		'properties-comments-alphabetical',
		{
			'properties-order': 'alphabetical',
		},
		__dirname,
	));

test(`Preserve-empty-lines-between properties`, () =>
	runTest(
		'properties-preserve-empty-line',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Should sort properties (styled)', () =>
	runTest(
		'properties-simple.js',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Should sort properties in nested rules (styled)', () =>
	runTest(
		'properties-nested.js',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Should sort properties in css helper (styled)', () =>
	runTest(
		'inside-css-helper.js',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Ignore template literals in flat components (styled)', () =>
	runTest(
		'ignore-template-literals-flat.js',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Ignore template literals in nested components (styled)', () =>
	runTest(
		'ignore-template-literals-nested.js',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Should sort properties (html, <style> tag)', () =>
	runTest(
		'properties-style-tag.html',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));

test('Should sort properties (html, style attribute)', () =>
	runTest(
		'properties-style-attribute.html',
		{
			'properties-order': ['position', 'top', 'display', 'z-index'],
		},
		__dirname,
	));
