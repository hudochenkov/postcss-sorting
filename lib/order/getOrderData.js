import { isStandardSyntaxProperty } from '../isStandardSyntaxProperty.js';
import { isCustomProperty } from '../isCustomProperty.js';
import { isDollarVariable } from './isDollarVariable.js';
import { isAtVariable } from './isAtVariable.js';
import { calcAtRulePatternPriority } from './calcAtRulePatternPriority.js';
import { calcRulePatternPriority } from './calcRulePatternPriority.js';

/**
 * @import {
 * 	AtRuleTarget,
 * 	ExpectedOrder,
 * 	OrderKeyword,
 * 	PositionData,
 * 	RuleTarget,
 * 	SortableChildNode,
 * } from '../types.js'
 */

/**
 * @param {ExpectedOrder} expectedOrder
 * @param {SortableChildNode} node
 * @returns {PositionData | null}
 */
export function getOrderData(expectedOrder, node) {
	/** @type {Exclude<OrderKeyword, 'rules' | 'at-rules'> | undefined} */
	let nodeType;

	if (isAtVariable(node)) {
		nodeType = 'at-variables';
	} else if (node.type === 'decl') {
		if (isCustomProperty(node.prop)) {
			nodeType = 'custom-properties';
		} else if (isDollarVariable(node.prop)) {
			nodeType = 'dollar-variables';
		} else if (isStandardSyntaxProperty(node.prop)) {
			nodeType = 'declarations';
		}
	} else if (node.type === 'rule') {
		/** @type {RuleTarget} */
		const target = {
			selector: node.selector,
		};

		const rules = expectedOrder.rule;

		// Looking for most specified pattern, because it can match many patterns
		if (rules && rules.length) {
			let prioritizedPattern;
			let max = 0;

			for (const pattern of rules) {
				const priority = calcRulePatternPriority(pattern, target);

				if (priority > max) {
					max = priority;
					prioritizedPattern = pattern;
				}
			}

			if (prioritizedPattern) {
				return prioritizedPattern;
			}
		}
	} else if (node.type === 'atrule') {
		/** @type {AtRuleTarget} */
		const target = {
			name: node.name,
			hasBlock: false,
		};

		if (node.nodes && node.nodes.length) {
			target.hasBlock = true;
		}

		if (node.params && node.params.length) {
			target.parameter = node.params;
		}

		const atRules = expectedOrder['at-rule'];

		// Looking for most specified pattern, because it can match many patterns
		if (atRules && atRules.length) {
			let prioritizedPattern;
			let max = 0;

			for (const pattern of atRules) {
				const priority = calcAtRulePatternPriority(pattern, target);

				if (priority > max) {
					max = priority;
					prioritizedPattern = pattern;
				}
			}

			if (prioritizedPattern) {
				return prioritizedPattern;
			}
		}
	}

	if (nodeType) {
		const orderData = expectedOrder[nodeType];

		if (orderData) {
			return orderData;
		}
	}

	// Return null if there no patterns for that node
	return null;
}
