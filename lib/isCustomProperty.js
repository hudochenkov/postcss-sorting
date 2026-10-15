/**
 * @param {string} property
 * @returns {boolean}
 */
export function isCustomProperty(property) {
	return property.slice(0, 2) === '--';
}
