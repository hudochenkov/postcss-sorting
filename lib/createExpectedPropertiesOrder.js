const _ = require('lodash');

module.exports = function createExpectedPropertiesOrder(input) {
	const order = {};
	let optionsOrder = [];

	if (_.isPlainObject(input[0])) {
		input.forEach((item) => {
			optionsOrder = optionsOrder.concat(item.properties);
		});
	} else {
		optionsOrder = input;
	}

	optionsOrder.forEach((property, propertyIndex) => {
		order[property] = {
			propertyIndex
		};
	});

	return order;
};
