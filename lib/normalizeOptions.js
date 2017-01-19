'use strict';

/**
 * Normalize option value. `true` → `[true]`
 */

module.exports = function normalizeOptions(opts) {
	Object.keys(opts).forEach(function (option) {
		if (option.indexOf('-empty-line-before') > 0) {
			if (!Array.isArray(opts[option])) {
				opts[option] = [opts[option]];
			}
		}
	});

	return opts;
};
