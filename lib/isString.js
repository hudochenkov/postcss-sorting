/**
 * @param {unknown} str
 * @returns {str is string}
 */
export function isString(str) {
	return Boolean(str && typeof str.valueOf() === 'string');
}
