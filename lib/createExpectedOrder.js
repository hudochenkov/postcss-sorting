'use strict';

const _ = require('lodash');

module.exports = function createExpectedOrder(input) {
	const order = {};
	let position = 0;

	input.forEach((item) => {
		position += 1;

		if (_.isString(item) && item !== 'at-rules') {
			order[item] = {
				position,
			};
		} else {
			// If it's an object
			// Currently 'at-rules' only

			// Convert 'at-rules' into extended pattern
			if (item === 'at-rules') {
				item = {
					type: 'at-rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order[item.type]) {
				order[item.type] = [];
			}

			const nodeData = {
				position,
			};

			if (item.name) {
				nodeData.name = item.name;
			}

			if (item.parameter) {
				nodeData.parameter = item.parameter;

				if (_.isString(item.parameter)) {
					nodeData.parameter = new RegExp(item.parameter);
				}
			}

			if (item.hasBlock) {
				nodeData.hasBlock = item.hasBlock;
			}

			order[item.type].push(nodeData);
		}
	});

	return order;
};
