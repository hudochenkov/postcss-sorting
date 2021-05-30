const order = require('./lib/order');
const propertiesOrder = require('./lib/properties-order');
const validateOptions = require('./lib/validateOptions');
const isString = require('./lib/isString');

module.exports = (opts) => {
	return {
		postcssPlugin: 'postcss-sorting',
		Root(css) {
			plugin(css, opts);
		},
	};
};

module.exports.postcss = true;

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

	if (opts.order) {
		order(css, opts);
	}

	if (opts['properties-order']) {
		propertiesOrder(css, opts);
	}
}
