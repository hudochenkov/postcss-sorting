import { validateOptions } from './lib/validateOptions.js';
import { isString } from './lib/isString.js';
import { getContainingNode } from './lib/getContainingNode.js';
import { sortNode } from './lib/order/sortNode.js';
import { sortNodeProperties } from './lib/properties-order/sortNodeProperties.js';

/** @import { Plugin, Root } from 'postcss' */
/** @import { PluginOptions } from './lib/types.js' */

/**
 * @param {PluginOptions} [opts]
 * @returns {Plugin}
 */
function postcssSorting(opts) {
	return {
		postcssPlugin: 'postcss-sorting',
		Root(css) {
			plugin(css, opts);
		},
	};
}

postcssSorting.postcss = true;

export default postcssSorting;

/**
 * @param {Root} css
 * @param {PluginOptions} [opts]
 */
function plugin(css, opts) {
	const validatedOptions = validateOptions(opts);

	if (validatedOptions !== true) {
		const throwValidateErrors = (opts && opts['throw-validate-errors']) || false;

		if (throwValidateErrors) {
			if (isString(validatedOptions)) {
				throw new Error(validatedOptions);
			}

			throw new Error(`postcss-sorting: Invalid config.`);
		} else {
			// eslint-disable-next-line no-console
			if (console && console.warn && isString(validatedOptions)) {
				console.warn(validatedOptions); // eslint-disable-line no-console
			}

			return;
		}
	}

	const order = opts?.order;

	if (order) {
		css.walk((input) => {
			const node = getContainingNode(input);

			sortNode(node, order);
		});
	}

	const propertiesOrder = opts?.['properties-order'];

	if (propertiesOrder) {
		css.walk((input) => {
			const node = getContainingNode(input);

			sortNodeProperties(node, {
				order: propertiesOrder,
				unspecifiedPropertiesPosition:
					opts?.['unspecified-properties-position'] || 'bottom',
			});
		});
	}
}

/** These are not a public API, and could be removed at any point */
export { sortNode, sortNodeProperties }; // eslint-disable-line unicorn/prefer-export-from
