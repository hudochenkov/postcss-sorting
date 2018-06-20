/**
 * Check whether a property is a @-variable
 *
 * @param {string} property
 * @return {boolean} If `true`, property is a @-variable
 */
'use strict';

module.exports = function isAtVariable(property) {
	return property[0] === '@';
};
