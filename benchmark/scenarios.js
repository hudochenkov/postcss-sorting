import { options } from './config.js';
import { createExpectedOrder } from '../lib/order/createExpectedOrder.js';
import { createExpectedPropertiesOrder } from '../lib/properties-order/createExpectedPropertiesOrder.js';
import { getPropertiesOrderData } from '../lib/properties-order/getPropertiesOrderData.js';
import { isShorthand } from '../lib/properties-order/isShorthand.js';
import { unprefixed } from '../lib/properties-order/vendor.js';
import { validateOptions } from '../lib/validateOptions.js';

/** @import { PluginOptions } from '../lib/types.js' */

/** @typedef {'real' | 'wide-rule' | 'deep-nesting' | 'many-comments' | 'many-rules'} InputName */

/**
 * Plugin scenarios run the plugin on a clone of a parsed tree.
 * `sorted` runs it on a tree that has already been sorted with the same options.
 *
 * @type {{ name: string, group: string, input: InputName, options: PluginOptions, sorted?: boolean }[]}
 */
export const pluginScenarios = [
	{
		name: 'all',
		group: 'real',
		input: 'real',
		options,
	},
	{
		name: 'all, already sorted',
		group: 'real',
		input: 'real',
		options,
		sorted: true,
	},
	{
		name: 'order only',
		group: 'real',
		input: 'real',
		options: { order: options.order },
	},
	{
		name: 'properties-order only',
		group: 'real',
		input: 'real',
		options: {
			'properties-order': options['properties-order'],
			'unspecified-properties-position': 'bottom',
		},
	},
	{
		name: 'alphabetical',
		group: 'real',
		input: 'real',
		options: { order: options.order, 'properties-order': 'alphabetical' },
	},
	{
		name: 'unspecified top',
		group: 'real',
		input: 'real',
		options: { ...options, 'unspecified-properties-position': 'top' },
	},
	{
		name: 'unspecified bottomAlphabetical',
		group: 'real',
		input: 'real',
		options: { ...options, 'unspecified-properties-position': 'bottomAlphabetical' },
	},
	{
		name: 'wide rule',
		group: 'synthetic',
		input: 'wide-rule',
		options,
	},
	{
		name: 'deep nesting',
		group: 'synthetic',
		input: 'deep-nesting',
		options,
	},
	{
		name: 'many comments',
		group: 'synthetic',
		input: 'many-comments',
		options,
	},
	{
		name: 'many rules',
		group: 'synthetic',
		input: 'many-rules',
		options,
	},
];

const propertyNames = options['properties-order'];
const shorthandPairs = [
	['margin', 'margin-top'],
	['border', 'border-top-color'],
	['font', 'color'],
	['background', 'background-position-x'],
];
const prefixedProperties = ['-webkit-box-shadow', 'color', '-moz-osx-font-smoothing', 'margin'];

/**
 * @param {number} repeat
 * @param {(index: number) => unknown} fn
 * @returns {() => void}
 */
function repeated(repeat, fn) {
	return () => {
		let sink;

		for (let index = 0; index < repeat; index++) {
			sink = fn(index);
		}

		return sink;
	};
}

/**
 * Helpers that run for every node, so they are measured as batches of calls.
 */
export const microScenarios = [
	{
		name: 'validateOptions ×1000',
		run: repeated(1000, () => validateOptions(options)),
	},
	{
		name: 'createExpectedOrder ×1000',
		run: repeated(1000, () => createExpectedOrder(options.order)),
	},
	{
		name: 'createExpectedPropertiesOrder ×200',
		run: repeated(200, () => createExpectedPropertiesOrder(propertyNames)),
	},
	{
		name: 'getPropertiesOrderData ×10000',
		run: (() => {
			const expected = createExpectedPropertiesOrder(propertyNames);

			return repeated(10000, (index) =>
				getPropertiesOrderData(expected, propertyNames[index % propertyNames.length] ?? ''),
			);
		})(),
	},
	{
		name: 'isShorthand ×10000',
		run: repeated(10000, (index) => {
			const [a, b] = shorthandPairs[index % shorthandPairs.length] ?? ['', ''];

			return isShorthand(a ?? '', b ?? '');
		}),
	},
	{
		name: 'vendor.unprefixed ×10000',
		run: repeated(10000, (index) =>
			unprefixed(prefixedProperties[index % prefixedProperties.length] ?? ''),
		),
	},
];
