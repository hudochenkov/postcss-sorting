'use strict';

const test = require('ava');
const validateOptions = require('../lib/validateOptions');

function testConfig(input) {
	let testFn;

	if (input.only) {
		testFn = test.only;
	} else if (input.skip) {
		testFn = test.skip;
	} else if (input.failing) {
		testFn = test.failing;
	} else {
		testFn = test;
	}

	testFn(input.description, (t) => {
		if (input.valid) {
			t.true(validateOptions(input.config));
		} else {
			t.truthy(validateOptions(input.config).length);
		}
	});
}

test('do nothing if config is missing', (t) => {
	t.false(validateOptions());
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
			}
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
		order: [
			'custom-property',
		],
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
	description: 'valid. default order (one object)',
	valid: true,
	config: {
		'properties-order': [
			{
				properties: [
					'color',
				],
			},
		],
	},
});

testConfig({
	description: 'valid. default order (two objects)',
	valid: true,
	config: {
		'properties-order': [
			{
				properties: [
					'color',
				],
			},
			{
				properties: [
					'display',
				],
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
		'properties-order': [
			'color',
		],
	},
});

testConfig({
	description: 'valid. default order (two properties)',
	valid: true,
	config: {
		'properties-order': [
			'color',
			'display',
		],
	},
});

testConfig({
	description: 'invalid. mixed objects and strings',
	valid: false,
	config: {
		'properties-order': [
			{
				properties: [
					'color',
				],
			},
			'display',
		],
	},
});

testConfig({
	description: 'invalid. object lacks \'properties\' property',
	valid: false,
	config: {
		'properties-order': [
			{
				emptyLineBefore: true
			},
		],
	},
});

testConfig({
	description: 'invalid. object outside of array',
	valid: false,
	config: {
		'properties-order': {
			properties: [
				'color',
			],
		},
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
	description: 'valid. emptyLineBefore is optional',
	valid: true,
	config: {
		'properties-order': [
			{
				properties: [
					'color',
				],
			},
			{
				emptyLineBefore: true,
				properties: [
					'display',
				],
			},
		],
	},
});

testConfig({
	description: 'invalid. emptyLineBefore isn\'t boolean',
	valid: false,
	config: {
		'properties-order': [
			{
				emptyLineBefore: 'nope',
				properties: [
					'display',
				],
			},
		],
	},
});

testConfig({
	description: 'invalid. not boolean',
	valid: false,
	config: {
		'clean-empty-lines': 'nope',
	},
});

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'clean-empty-lines': false,
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

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'custom-property-empty-line-before': true,
	},
});

testConfig({
	description: 'valid. boolean in array',
	valid: true,
	config: {
		'custom-property-empty-line-before': [true],
	},
});

testConfig({
	description: 'invalid. first item in array isn\'t boolean',
	valid: false,
	config: {
		'custom-property-empty-line-before': [
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. except keyword',
	valid: true,
	config: {
		'custom-property-empty-line-before': [
			false,
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. multiple excepts',
	valid: true,
	config: {
		'custom-property-empty-line-before': [
			false,
			{
				except: ['after-comment', 'first-nested'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except keyword',
	valid: false,
	config: {
		'custom-property-empty-line-before': [
			true,
			{
				except: ['before-comment'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except not an array',
	valid: false,
	config: {
		'custom-property-empty-line-before': [
			false,
			{
				except: 'after-comment',
			},
		],
	},
});

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'custom-property-empty-line-before': true,
	},
});

testConfig({
	description: 'valid. boolean in array',
	valid: true,
	config: {
		'custom-property-empty-line-before': [true],
	},
});

testConfig({
	description: 'invalid. first item in array isn\'t boolean',
	valid: false,
	config: {
		'custom-property-empty-line-before': [
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. except keyword',
	valid: true,
	config: {
		'custom-property-empty-line-before': [
			false,
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. multiple excepts',
	valid: true,
	config: {
		'custom-property-empty-line-before': [
			false,
			{
				except: ['after-comment', 'first-nested'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except keyword',
	valid: false,
	config: {
		'custom-property-empty-line-before': [
			true,
			{
				except: ['before-comment'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except not an array',
	valid: false,
	config: {
		'custom-property-empty-line-before': [
			false,
			{
				except: 'after-comment',
			},
		],
	},
});

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'dollar-variable-empty-line-before': true,
	},
});

testConfig({
	description: 'valid. boolean in array',
	valid: true,
	config: {
		'dollar-variable-empty-line-before': [true],
	},
});

testConfig({
	description: 'invalid. first item in array isn\'t boolean',
	valid: false,
	config: {
		'dollar-variable-empty-line-before': [
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. except keyword',
	valid: true,
	config: {
		'dollar-variable-empty-line-before': [
			false,
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. multiple excepts',
	valid: true,
	config: {
		'dollar-variable-empty-line-before': [
			false,
			{
				except: ['after-comment', 'first-nested'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except keyword',
	valid: false,
	config: {
		'dollar-variable-empty-line-before': [
			true,
			{
				except: ['before-comment'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except not an array',
	valid: false,
	config: {
		'dollar-variable-empty-line-before': [
			false,
			{
				except: 'after-comment',
			},
		],
	},
});

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'declaration-empty-line-before': true,
	},
});

testConfig({
	description: 'valid. boolean in array',
	valid: true,
	config: {
		'declaration-empty-line-before': [true],
	},
});

testConfig({
	description: 'invalid. first item in array isn\'t boolean',
	valid: false,
	config: {
		'declaration-empty-line-before': [
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. except keyword',
	valid: true,
	config: {
		'declaration-empty-line-before': [
			false,
			{
				except: ['after-comment'],
			},
		],
	},
});

testConfig({
	description: 'valid. multiple excepts',
	valid: true,
	config: {
		'declaration-empty-line-before': [
			false,
			{
				except: ['after-comment', 'first-nested'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except keyword',
	valid: false,
	config: {
		'declaration-empty-line-before': [
			true,
			{
				except: ['before-comment'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except not an array',
	valid: false,
	config: {
		'declaration-empty-line-before': [
			false,
			{
				except: 'after-comment',
			},
		],
	},
});

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'rule-nested-empty-line-before': true,
	},
});

testConfig({
	description: 'valid. boolean in array',
	valid: true,
	config: {
		'rule-nested-empty-line-before': [true],
	},
});

testConfig({
	description: 'valid. keyword',
	valid: true,
	config: {
		'rule-nested-empty-line-before': 'always-multi-line',
	},
});

testConfig({
	description: 'valid. keyword in array',
	valid: true,
	config: {
		'rule-nested-empty-line-before': ['always-multi-line'],
	},
});
testConfig({
	description: 'invalid. keyword in array',
	valid: false,
	config: {
		'rule-nested-empty-line-before': ['always-single-line'],
	},
});

testConfig({
	description: 'invalid. first item in array isn\'t boolean',
	valid: false,
	config: {
		'rule-nested-empty-line-before': [
			{
				except: ['first-nested'],
			},
		],
	},
});

testConfig({
	description: 'valid. except keyword',
	valid: true,
	config: {
		'rule-nested-empty-line-before': [
			false,
			{
				except: ['first-nested'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except keyword',
	valid: false,
	config: {
		'rule-nested-empty-line-before': [
			true,
			{
				except: ['second-nested'],
			},
		],
	},
});

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'at-rule-nested-empty-line-before': true,
	},
});

testConfig({
	description: 'valid. boolean in array',
	valid: true,
	config: {
		'at-rule-nested-empty-line-before': [true],
	},
});

testConfig({
	description: 'invalid. first item in array isn\'t boolean',
	valid: false,
	config: {
		'at-rule-nested-empty-line-before': [
			{
				except: ['blockless-after-blockless'],
			},
		],
	},
});

testConfig({
	description: 'valid. except keyword',
	valid: true,
	config: {
		'at-rule-nested-empty-line-before': [
			false,
			{
				except: ['blockless-after-blockless'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except keyword',
	valid: false,
	config: {
		'at-rule-nested-empty-line-before': [
			true,
			{
				except: ['blockless-after-blockless-sdfsffsd'],
			},
		],
	},
});

testConfig({
	description: 'valid. ignoreAtRules string in array',
	valid: true,
	config: {
		'at-rule-nested-empty-line-before': [
			true,
			{
				ignoreAtRules: ['media'],
			},
		],
	},
});

testConfig({
	description: 'invalid. ignoreAtRules not an array',
	valid: false,
	config: {
		'at-rule-nested-empty-line-before': [
			true,
			{
				ignoreAtRules: 'media',
			},
		],
	},
});

testConfig({
	description: 'invalid. ignoreAtRules not a string an array',
	valid: false,
	config: {
		'at-rule-nested-empty-line-before': [
			true,
			{
				ignoreAtRules: [/media/],
			},
		],
	},
});

testConfig({
	description: 'valid. boolean',
	valid: true,
	config: {
		'comment-empty-line-before': true,
	},
});

testConfig({
	description: 'valid. boolean in array',
	valid: true,
	config: {
		'comment-empty-line-before': [true],
	},
});

testConfig({
	description: 'invalid. first item in array isn\'t boolean',
	valid: false,
	config: {
		'comment-empty-line-before': [
			{
				except: ['first-nested'],
			},
		],
	},
});

testConfig({
	description: 'valid. except keyword',
	valid: true,
	config: {
		'comment-empty-line-before': [
			false,
			{
				except: ['first-nested'],
			},
		],
	},
});

testConfig({
	description: 'invalid. except keyword',
	valid: false,
	config: {
		'comment-empty-line-before': [
			true,
			{
				except: ['first-nested-ssssdsf'],
			},
		],
	},
});
