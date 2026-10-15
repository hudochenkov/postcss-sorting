import { isString } from '../isString.js';

/** @import { AtRulePattern, ExpectedOrder, OrderOptionItem, RulePattern } from '../types.js' */

/**
 * @param {OrderOptionItem[]} input
 * @returns {ExpectedOrder}
 */
export function createExpectedOrder(input) {
	/** @type {ExpectedOrder} */
	const order = {};
	let position = 0;

	input.forEach((originalItem) => {
		let item = originalItem;

		position += 1;

		if (isString(item) && item !== 'at-rules' && item !== 'rules') {
			order[item] = {
				position,
			};
		}

		if (item === 'rules' || (!isString(item) && item.type === 'rule')) {
			// Convert 'rules' into extended pattern
			if (item === 'rules') {
				item = {
					type: 'rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order.rule) {
				order.rule = [];
			}

			/** @type {RulePattern} */
			const nodeData = {
				position,
			};

			if (item.selector) {
				nodeData.selector = isString(item.selector)
					? new RegExp(item.selector)
					: item.selector;
			}

			order.rule.push(nodeData);
		}

		if (item === 'at-rules' || (!isString(item) && item.type === 'at-rule')) {
			// Convert 'at-rules' into extended pattern
			if (item === 'at-rules') {
				item = {
					type: 'at-rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order['at-rule']) {
				order['at-rule'] = [];
			}

			/** @type {AtRulePattern} */
			const nodeData = {
				position,
			};

			if (item.name) {
				nodeData.name = item.name;
			}

			if (item.parameter) {
				nodeData.parameter = isString(item.parameter)
					? new RegExp(item.parameter)
					: item.parameter;
			}

			if (item.hasBlock !== undefined) {
				nodeData.hasBlock = item.hasBlock;
			}

			order['at-rule'].push(nodeData);
		}
	});

	return order;
}
