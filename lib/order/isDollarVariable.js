/**
 * @param {string} property
 * @returns {boolean}
 */
export function isDollarVariable(property) {
	return property[0] === '$';
}
