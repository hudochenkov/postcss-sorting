/** @import { ExpectedPropertiesOrder } from '../types.js' */

/**
 * @param {string[]} input
 * @returns {ExpectedPropertiesOrder}
 */
export function createExpectedPropertiesOrder(input) {
	/** @type {ExpectedPropertiesOrder} */
	const order = {};

	input.forEach((property, propertyIndex) => {
		order[property] = {
			propertyIndex,
		};
	});

	return order;
}
