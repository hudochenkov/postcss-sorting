/** @import { ExpectedPropertiesOrder, PropertyOrderData } from '../types.js' */

/**
 * @param {ExpectedPropertiesOrder} expectedOrder
 * @param {string} propName
 * @returns {PropertyOrderData | undefined}
 */
export function getPropertiesOrderData(expectedOrder, propName) {
	return expectedOrder[propName];
}
