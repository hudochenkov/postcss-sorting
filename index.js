'use strict';

const postcss = require('postcss');
const _ = require('lodash');

const features = require('./lib/features');
const isSet = require('./lib/isSet');
const normalizeOptions = require('./lib/normalizeOptions');
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

	opts = normalizeOptions(opts);

	Object.keys(features).forEach(function (featureName) {
		if (isSet(opts[featureName])) {
			features[featureName](css, opts);
		}
	});
}
