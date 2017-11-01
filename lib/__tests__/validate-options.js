const validateOptions = require('../validateOptions');

function testConfig(input) {
	let testFn;

	if (input.only) {
		testFn = test.only;
	} else if (input.skip) {
		testFn = test.skip;
	} else {
		testFn = test;
	}

	testFn(input.description, () => {
		if (input.valid) {
			expect(validateOptions(input.config)).toBe(true);
		} else {
			expect(validateOptions(input.config).length).toBeTruthy();
		}
	});
}

test('do nothing if config is missing', () => {
	expect(validateOptions()).toBe(false);
});

testConfig({
	description: 'config should be an object',
	valid: true,
	config: {},
});

testConfig({
	description: 'config should be an object',
	valid: false,
	config: 'nope',
});

testConfig({
	description: 'should be an array',
	valid: false,
	config: {
		order: 'custom-properties',
	},
});

testConfig({
	description: 'valid keywords',
	valid: true,
	config: {
		order: [
			'custom-properties',
			'dollar-variables',
			'at-variables',
			'declarations',
			'rules',
			'at-rules',
		],
	},
});

testConfig({
	description: 'valid at-rules variants',
	valid: true,
	config: {
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
				hasBlock: false,
			},
			{
				type: 'at-rule',
			},
		],
	},
});

testConfig({
	description: 'valid rules variants',
	valid: true,
	config: {
		order: [
			{
				type: 'rule',
				selector: /^&:\w/,
			},
			{
				type: 'rule',
				selector: '^&:\\w',
			},
			{
				type: 'rule',
			},
		],
	},
});

testConfig({
	description: 'valid keyword with at-rule variant (keyword last)',
	valid: true,
	config: {
		order: [
			{
				type: 'at-rule',
			},
			'declarations',
		],
	},
});

testConfig({
	description: 'invalid keyword',
	valid: false,
	config: {
		order: ['custom-property'],
	},
});

testConfig({
	description: 'invalid at-rule type',
	valid: false,
	config: {
		order: [
			{
				type: 'atrule',
			},
		],
	},
});

testConfig({
	description: 'invalid hasBlock property',
	valid: false,
	config: {
		order: [
			{
				type: 'at-rule',
				hasBlock: 'yes',
			},
		],
	},
});

testConfig({
	description: 'invalid name property',
	valid: false,
	config: {
		order: [
			{
				type: 'at-rule',
				name: '',
			},
		],
	},
});

testConfig({
	description: 'invalid name property with hasBlock defined',
	valid: false,
	config: {
		order: [
			{
				type: 'at-rule',
				hasBlock: true,
				name: '',
			},
		],
	},
});

testConfig({
	description: 'valid parameter (string) and name',
	valid: true,
	config: {
		order: [
			{
				type: 'at-rule',
				name: 'include',
				parameter: 'media',
			},
		],
	},
});

testConfig({
	description: 'valid parameter (RegExp) and name',
	valid: true,
	config: {
		order: [
			{
				type: 'at-rule',
				name: 'include',
				parameter: /$media/,
			},
		],
	},
});

testConfig({
	description: 'invalid. parameter is empty',
	valid: false,
	config: {
		order: [
			{
				type: 'at-rule',
				name: 'include',
				parameter: '',
			},
		],
	},
});

testConfig({
	description: 'invalid. parameter is not a string',
	valid: false,
	config: {
		order: [
			{
				type: 'at-rule',
				name: 'include',
				parameter: null,
			},
		],
	},
});

testConfig({
	description: 'invalid. parameter without "name" property',
	valid: false,
	config: {
		order: [
			{
				type: 'at-rule',
				parameter: 'media',
			},
		],
	},
});

testConfig({
	description: 'valid selector (string)',
	valid: true,
	config: {
		order: [
			{
				type: 'rule',
				selector: '^&:hover',
			},
		],
	},
});

testConfig({
	description: 'valid selector (RegExp)',
	valid: true,
	config: {
		order: [
			{
				type: 'rule',
				selector: /^&:\w/,
			},
		],
	},
});

testConfig({
	description: 'invalid. selector is empty',
	valid: false,
	config: {
		order: [
			{
				type: 'rule',
				selector: '',
			},
		],
	},
});

testConfig({
	description: 'invalid. selector is not a string',
	valid: false,
	config: {
		order: [
			{
				type: 'rule',
				selector: null,
			},
		],
	},
});

testConfig({
	description: 'valid. alphabetical',
	valid: true,
	config: {
		'properties-order': 'alphabetical',
	},
});

testConfig({
	description: 'valid. default order (one property)',
	valid: true,
	config: {
		'properties-order': ['color'],
	},
});

testConfig({
	description: 'valid. default order (two properties)',
	valid: true,
	config: {
		'properties-order': ['color', 'display'],
	},
});

testConfig({
	description: 'invalid. mixed objects and strings',
	valid: false,
	config: {
		'properties-order': [
			{
				properties: ['color'],
			},
			'display',
		],
	},
});

testConfig({
	description: 'invalid. not an array',
	valid: false,
	config: {
		'properties-order': 'declarations',
	},
});

testConfig({
	description: 'valid. reserved keyword',
	valid: true,
	config: {
		'unspecified-properties-position': 'bottom',
	},
});

testConfig({
	description: 'invalid. not a reserved keyword',
	valid: false,
	config: {
		'unspecified-properties-position': 'atbottom',
	},
});

testConfig({
	description: 'invalid. not a string',
	valid: false,
	config: {
		'unspecified-properties-position': ['bottom'],
	},
});
