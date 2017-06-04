'use strict';

const postcss = require('postcss');
const _ = require('lodash');

const order = require('./lib/order');
const propertiesOrder = require('./lib/properties-order');
const validateOptions = require('./lib/validateOptions');

module.exports = postcss.plugin('postcss-sorting', function (opts) {
	return function (css) {
		plugin(css, opts);
	};
});

function plugin(css, opts) {
	const validatedOptions = validateOptions(opts);

	if (validatedOptions !== true) {
		if (console && console.warn && _.isString(validatedOptions)) { // eslint-disable-line no-console
			console.warn(validatedOptions); // eslint-disable-line no-console
		}

		return;
	}

	if (opts.order) {
		order(css, opts);
	}

	if (opts['properties-order']) {
		propertiesOrder(css, opts);
	}
}
