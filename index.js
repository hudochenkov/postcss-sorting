'use strict';

const postcss = require('postcss');
const _ = require('lodash');

const isStandardSyntaxProperty = require('./lib/isStandardSyntaxProperty');
const isCustomProperty = require('./lib/isCustomProperty');
const isRuleWithNodes = require('./lib/isRuleWithNodes');

const validateOptions = require('./lib/validateOptions');
const createExpectedOrder = require('./lib/createExpectedOrder');
const createExpectedPropertiesOrder = require('./lib/createExpectedPropertiesOrder');
const processMostNodes = require('./lib/processMostNodes');
const processLastComments = require('./lib/processLastComments');
const getPropertiesOrderData = require('./lib/getPropertiesOrderData');
const sorting = require('./lib/sorting');
const getComments = require('./lib/getComments');
const cleanEmptyLines = require('./lib/cleanEmptyLines');
const emptyLineBeforeGroup = require('./lib/emptyLineBeforeGroup');

module.exports = postcss.plugin('postcss-sorting', function (opts) {
	return function (css) {
		plugin(css, opts);
	};
});

function plugin(css, opts) {
	if (!validateOptions(opts)) {
		return;
	}

	// Having this option before `properties-order`, because later one can add empty lines by `emptyLineBefore`
	if (opts['clean-empty-lines']) {
		css.walk(function (node) {
			if (isRuleWithNodes(node)) {
				// Remove empty lines before every node
				node.each(function (childNode) {
					if (childNode.raws.before) {
						childNode.raws.before = cleanEmptyLines(childNode.raws.before);
					}
				});

				// Remove empty lines after the last node
				if (node.raws.after) {
					node.raws.after = cleanEmptyLines(node.raws.after);
				}
			}
		});
	}

	if (opts.order) {
		const expectedOrder = createExpectedOrder(opts.order);

		css.walk(function (node) {
			// Process only rules and atrules with nodes
			if (isRuleWithNodes(node)) {
				// Nodes for sorting
				let processed = [];

				// Add indexes to nodes
				node.each(function (childNode, index) {
					processed = processMostNodes(childNode, index, expectedOrder, processed);
				});

				// Add last comments in the rule. Need this because last comments are not belonging to anything
				node.each(function (childNode, index) {
					processed = processLastComments(childNode, index, processed);
				});

				// Sort declarations saved for sorting
				processed.sort(sorting.sortByIndexes);

				// Enforce semicolon for the last node
				node.raws.semicolon = true;

				// Replace rule content with sorted one
				node.removeAll();
				node.append(processed);
			}
		});
	}

	if (opts['properties-order']) {
		const isAlphabetical = opts['properties-order'] === 'alphabetical';
		const expectedOrder = isAlphabetical ? null : createExpectedPropertiesOrder(opts['properties-order']);
		const unspecifiedPropertiesPosition = _.get(opts, ['unspecified-properties-position'], 'bottom');

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
							unspecifiedPropertiesPosition
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
	}
}
