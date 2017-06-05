'use strict';

module.exports = function getPropertiesOrderData(expectedOrder, propName) {
	let orderData = expectedOrder[propName];
	// If prop was not specified but has a hyphen
	// (e.g. `padding-top`), try looking for the segment preceding the hyphen
	// and use that index

	if (!orderData && propName.lastIndexOf('-') !== -1) {
		const propNamePreHyphen = propName.slice(0, propName.lastIndexOf('-'));

		orderData = getPropertiesOrderData(expectedOrder, propNamePreHyphen);
	}

	return orderData;
};
