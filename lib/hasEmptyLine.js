'use strict';

const _ = require('lodash');

/**
 * Check if a string contains at least one empty line
 */
module.exports = function (string) {
	if (string === '' || _.isUndefined(string)) {
		return false;
	}

	return string.indexOf('\n\n') !== -1 || string.indexOf('\n\r\n') !== -1;
};
