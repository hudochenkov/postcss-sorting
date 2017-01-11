'use strict';

const isStandardSyntaxProperty = require('./isStandardSyntaxProperty');
const isCustomProperty = require('./isCustomProperty');
const isDollarVariable = require('./isDollarVariable');
const calcPatternPriority = require('./calcPatternPriority');

module.exports = function getOrderData(expectedOrder, node) {
	let nodeType;

	if (node.type === 'decl') {
		if (isCustomProperty(node.prop)) {
			nodeType = 'custom-properties';
		} else if (isDollarVariable(node.prop)) {
			nodeType = 'dollar-variables';
		} else if (isStandardSyntaxProperty(node.prop)) {
			nodeType = 'declarations';
		}
	} else if (node.type === 'rule') {
		nodeType = 'rules';
	} else if (node.type === 'atrule') {
		nodeType = {
			type: 'at-rule',
			name: node.name,
			hasBlock: false,
		};

		if (node.nodes && node.nodes.length) {
			nodeType.hasBlock = true;
		}

		if (node.params && node.params.length) {
			nodeType.parameter = node.params;
		}

		const atRules = expectedOrder['at-rule'];

		// Looking for most specified pattern, because it can match many patterns
		if (atRules && atRules.length) {
			let prioritizedPattern;
			let max = 0;

			atRules.forEach(function (pattern) {
				const priority = calcPatternPriority(pattern, nodeType);

				if (priority > max) {
					max = priority;
					prioritizedPattern = pattern;
				}
			});

			if (max) {
				return prioritizedPattern;
			}
		}
	}

	if (expectedOrder[nodeType]) {
		return expectedOrder[nodeType];
	}

	// Return null if there no patterns for that node
	return null;
};
