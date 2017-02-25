'use strict';

const postcss = require('postcss');

const createExpectedPropertiesOrder = require('../createExpectedPropertiesOrder');
const emptyLineBeforeGroup = require('../emptyLineBeforeGroup');
const getComments = require('../getComments');
const getPropertiesOrderData = require('../getPropertiesOrderData');
const isCustomProperty = require('../isCustomProperty');
const isRuleWithNodes = require('../isRuleWithNodes');
const isSet = require('../isSet');
const isStandardSyntaxProperty = require('../isStandardSyntaxProperty');
const sorting = require('../sorting');

module.exports = function (css, opts) {
	const isAlphabetical = opts['properties-order'] === 'alphabetical';
	const expectedOrder = isAlphabetical ? null : createExpectedPropertiesOrder(opts['properties-order']);
	let unspecifiedPropertiesPosition = opts['unspecified-properties-position'];

	if (!isSet(unspecifiedPropertiesPosition)) {
		unspecifiedPropertiesPosition = 'bottom';
	}

	css.walk(function (node) {
		// Process only rules and atrules with nodes
		if (isRuleWithNodes(node)) {
			const allRuleNodes = [];
			let declarations = [];

			node.each(function (childNode, index) {
				if (
					childNode.type === 'decl' &&
					isStandardSyntaxProperty(childNode.prop) &&
					!isCustomProperty(childNode.prop)
				) {
					const unprefixedPropName = postcss.vendor.unprefixed(childNode.prop);

					const propData = {
						name: childNode.prop,
						unprefixedName: unprefixedPropName,
						orderData: isAlphabetical ? null : getPropertiesOrderData(expectedOrder, unprefixedPropName),
						node: childNode,
						initialIndex: index,
						unspecifiedPropertiesPosition,
					};

					// add a marker
					childNode.sortProperty = true;

					// If comment on separate line before node, use node's indexes for comment
					const commentsBefore = getComments.beforeDeclaration([], childNode.prev(), propData);

					// If comment on same line with the node and node, use node's indexes for comment
					const commentsAfter = getComments.afterDeclaration([], childNode.next(), propData);

					declarations = declarations.concat(commentsBefore, propData, commentsAfter);
				}
			});

			if (isAlphabetical) {
				declarations.sort(sorting.sortDeclarationsAlphabetically);
			} else {
				declarations.sort(sorting.sortDeclarations);
			}

			// Process empty line before group
			declarations.forEach(emptyLineBeforeGroup);

			let foundDeclarations = false;

			node.each(function (childNode) {
				if (childNode.sortProperty) {
					if (!foundDeclarations) {
						foundDeclarations = true;

						declarations.forEach((item) => {
							allRuleNodes.push(item.node);
						});
					}
				} else {
					allRuleNodes.push(childNode);
				}
			});

			node.removeAll();
			node.append(allRuleNodes);
		}
	});
};
