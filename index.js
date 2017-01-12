'use strict';

const postcss = require('postcss');
const _ = require('lodash');

const isStandardSyntaxProperty = require('./lib/isStandardSyntaxProperty');
const isStandardSyntaxDeclaration = require('./lib/isStandardSyntaxDeclaration');
const isCustomProperty = require('./lib/isCustomProperty');
const isDollarVariable = require('./lib/isDollarVariable');
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
const isSingleLineBlock = require('./lib/isSingleLineBlock');
const isSingleLineString = require('./lib/isSingleLineString');
const hasEmptyLine = require('./lib/hasEmptyLine');
const createEmptyLines = require('./lib/createEmptyLines');
const isStandardSyntaxRule = require('./lib/isStandardSyntaxRule');
const hasBlock = require('./lib/hasBlock');
const hasNonSharedLineCommentBefore = require('./lib/hasNonSharedLineCommentBefore');
const hasSharedLineCommentBefore = require('./lib/hasSharedLineCommentBefore');

module.exports = postcss.plugin('postcss-sorting', function (opts) {
	return function (css) {
		plugin(css, opts);
	};
});

function plugin(css, opts) {
	const validatedOptions = validateOptions(opts);

	if (validatedOptions !== true) {
		if (console && console.warn && _.isString(validatedOptions)) { // eslint-disable-line no-console
			console.warn(validatedOptions); // eslint-disable-line no-console
		}

		return;
	}

	// Having this option before `properties-order`, because later one can add empty lines by `emptyLineBefore`
	if (opts['clean-empty-lines'] === true) {
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

	if (
		!_.isUndefined(opts.order)
		&& !_.isNull(opts.order)
	) {
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

	if (
		!_.isUndefined(opts['properties-order'])
		&& !_.isNull(opts['properties-order'])
	) {
		const isAlphabetical = opts['properties-order'] === 'alphabetical';
		const expectedOrder = isAlphabetical ? null : createExpectedPropertiesOrder(opts['properties-order']);
		let unspecifiedPropertiesPosition = opts['unspecified-properties-position'];

		if (
			_.isUndefined(unspecifiedPropertiesPosition)
			|| _.isNull(unspecifiedPropertiesPosition)
		) {
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
	}

	if (
		!_.isUndefined(opts['custom-property-empty-line-before'])
		&& !_.isNull(opts['custom-property-empty-line-before'])
	) {
		let customPropertyEmptyLineBefore = opts['custom-property-empty-line-before'];

		// Convert to common options format, e. g. `true` → `[true]`
		if (!_.isArray(customPropertyEmptyLineBefore)) {
			customPropertyEmptyLineBefore = [customPropertyEmptyLineBefore];
		}

		const optionName = 'custom-property-empty-line-before';

		css.walkDecls(function (decl) {
			const prop = decl.prop;
			const parent = decl.parent;

			if (!isStandardSyntaxDeclaration(decl) || !isCustomProperty(prop)) {
				return;
			}

			// Optionally ignore the node if a comment precedes it
			if (
				checkOption(optionName, 'ignore', 'after-comment')
				&& hasNonSharedLineCommentBefore(decl)
			) {
				return;
			}

			// Optionally ignore nodes inside single-line blocks
			if (
				checkOption(optionName, 'ignore', 'inside-single-line-block')
				&& isSingleLineBlock(parent)
			) {
				return;
			}

			let expectEmptyLineBefore = customPropertyEmptyLineBefore[0];

			// Optionally reverse the expectation for the first nested node
			if (
				checkOption(optionName, 'except', 'first-nested')
				&& decl === parent.first
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Optionally reverse the expectation if a comment precedes this node
			if (
				checkOption(optionName, 'except', 'after-comment')
				&& hasNonSharedLineCommentBefore(decl)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Optionally reverse the expectation if a custom property precedes this node
			if (
				checkOption(optionName, 'except', 'after-custom-property')
				&& decl.prev()
				&& (
					(
						decl.prev().prop
						&& isCustomProperty(decl.prev().prop)
					)
					|| (
						hasSharedLineCommentBefore(decl)
						&& decl.prev().prev()
						&& decl.prev().prev().prop
						&& isCustomProperty(decl.prev().prev().prop)
					)
				)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			const hasEmptyLineBefore = hasEmptyLine(decl.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			if (expectEmptyLineBefore) {
				if (decl.raws.before.indexOf('\n') === -1) {
					decl.raws.before = `\n${decl.raws.before}`;
				}

				decl.raws.before = createEmptyLines(1) + decl.raws.before;
			} else {
				decl.raws.before = cleanEmptyLines(decl.raws.before);
			}
		});
	}

	if (
		!_.isUndefined(opts['dollar-variable-empty-line-before'])
		&& !_.isNull(opts['dollar-variable-empty-line-before'])
	) {
		let dollarVariableEmptyLineBefore = opts['dollar-variable-empty-line-before'];

		// Convert to common options format, e. g. `true` → `[true]`
		if (!_.isArray(dollarVariableEmptyLineBefore)) {
			dollarVariableEmptyLineBefore = [dollarVariableEmptyLineBefore];
		}

		const optionName = 'dollar-variable-empty-line-before';

		css.walkDecls(function (decl) {
			const prop = decl.prop;
			const parent = decl.parent;

			if (!isDollarVariable(prop)) {
				return;
			}

			// Optionally ignore the node if a comment precedes it
			if (
				checkOption(optionName, 'ignore', 'after-comment')
				&& hasNonSharedLineCommentBefore(decl)
			) {
				return;
			}

			// Optionally ignore nodes inside single-line blocks
			if (
				checkOption(optionName, 'ignore', 'inside-single-line-block')
				&& isSingleLineBlock(parent)
			) {
				return;
			}

			let expectEmptyLineBefore = dollarVariableEmptyLineBefore[0];

			// Optionally reverse the expectation for the first nested node
			if (
				checkOption(optionName, 'except', 'first-nested')
				&& decl === parent.first
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Optionally reverse the expectation if a comment precedes this node
			if (
				checkOption(optionName, 'except', 'after-comment')
				&& hasNonSharedLineCommentBefore(decl)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Optionally reverse the expectation if a dollar variable precedes this node
			if (
				checkOption(optionName, 'except', 'after-dollar-variable')
				&& decl.prev()
				&& (
					(
						decl.prev().prop
						&& isDollarVariable(decl.prev().prop)
					)
					|| (
						hasSharedLineCommentBefore(decl)
						&& decl.prev().prev()
						&& decl.prev().prev().prop
						&& isDollarVariable(decl.prev().prev().prop)
					)
				)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			const hasEmptyLineBefore = hasEmptyLine(decl.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			if (expectEmptyLineBefore) {
				if (decl.raws.before.indexOf('\n') === -1) {
					decl.raws.before = `\n${decl.raws.before}`;
				}

				decl.raws.before = createEmptyLines(1) + decl.raws.before;
			} else {
				decl.raws.before = cleanEmptyLines(decl.raws.before);
			}
		});
	}

	if (
		!_.isUndefined(opts['declaration-empty-line-before'])
		&& !_.isNull(opts['declaration-empty-line-before'])
	) {
		let declarationEmptyLineBefore = opts['declaration-empty-line-before'];

		// Convert to common options format, e. g. `true` → `[true]`
		if (!_.isArray(declarationEmptyLineBefore)) {
			declarationEmptyLineBefore = [declarationEmptyLineBefore];
		}

		const optionName = 'declaration-empty-line-before';

		css.walkDecls(function (decl) {
			const prop = decl.prop;
			const parent = decl.parent;

			if (!isStandardSyntaxDeclaration(decl)) {
			  return;
			}

			if (isCustomProperty(prop)) {
			  return;
			}

			// Optionally ignore the node if a comment precedes it
			if (
				checkOption(optionName, 'ignore', 'after-comment')
				&& hasNonSharedLineCommentBefore(decl)
			) {
				return;
			}

			// Optionally ignore the node if a declaration precedes it
			if (
				checkOption(optionName, 'ignore', 'after-declaration')
				&& decl.prev()
				&& (
					isDeclarationBefore(decl.prev())
					|| (
						hasSharedLineCommentBefore(decl)
						&& isDeclarationBefore(decl.prev().prev())
					)
				)
			) {
				return;
			}

			// Optionally ignore nodes inside single-line blocks
			if (
				checkOption(optionName, 'ignore', 'inside-single-line-block')
				&& isSingleLineBlock(parent)
			) {
				return;
			}

			let expectEmptyLineBefore = declarationEmptyLineBefore[0];

			// Optionally reverse the expectation for the first nested node
			if (
				checkOption(optionName, 'except', 'first-nested')
				&& decl === parent.first
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Optionally reverse the expectation if a comment precedes this node
			if (
				checkOption(optionName, 'except', 'after-comment')
				&& hasNonSharedLineCommentBefore(decl)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Optionally reverse the expectation if a declaration precedes this node
			if (
				checkOption(optionName, 'except', 'after-declaration')
				&& decl.prev()
				&& (
					isDeclarationBefore(decl.prev())
					|| (
						hasSharedLineCommentBefore(decl)
						&& isDeclarationBefore(decl.prev().prev())
					)
				)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			const hasEmptyLineBefore = hasEmptyLine(decl.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			if (expectEmptyLineBefore) {
				if (decl.raws.before.indexOf('\n') === -1) {
					decl.raws.before = `\n${decl.raws.before}`;
				}

				decl.raws.before = createEmptyLines(1) + decl.raws.before;
			} else {
				decl.raws.before = cleanEmptyLines(decl.raws.before);
			}

			function isDeclarationBefore(targetDeclaration) {
				return targetDeclaration
					&& targetDeclaration.prop
					&& isStandardSyntaxDeclaration(targetDeclaration)
					&& !isCustomProperty(targetDeclaration.prop);
			}
		});
	}

	if (
		!_.isUndefined(opts['rule-nested-empty-line-before'])
		&& !_.isNull(opts['rule-nested-empty-line-before'])
	) {
		let ruleNestedEmptyLineBefore = opts['rule-nested-empty-line-before'];

		// Convert to common options format, e. g. `true` → `[true]`
		if (!_.isArray(ruleNestedEmptyLineBefore)) {
			ruleNestedEmptyLineBefore = [ruleNestedEmptyLineBefore];
		}

		const optionName = 'rule-nested-empty-line-before';

		css.walkRules(function (rule) {
			if (!isStandardSyntaxRule(rule)) {
				return;
			}

			// Only attend to nested rule sets
			if (rule.parent === css) {
				return;
			}

			// Optionally ignore the expectation if a non-shared-line comment precedes this node
			if (
				checkOption(optionName, 'ignore', 'after-comment')
				&& hasNonSharedLineCommentBefore(rule)
			) {
				return;
			}

			// Ignore if the expectation is for multiple and the rule is single-line
			if (
				(
					_.isString(ruleNestedEmptyLineBefore[0])
					&& ruleNestedEmptyLineBefore[0].indexOf('multi-line') !== -1
				)
				&& isSingleLineString(rule.toString())
			) {
				return;
			}

			let expectEmptyLineBefore = false;

			if (
				(
					_.isString(ruleNestedEmptyLineBefore[0])
					&& ruleNestedEmptyLineBefore[0].indexOf('always') !== -1
				)
				|| ruleNestedEmptyLineBefore[0] === true
			) {
				expectEmptyLineBefore = true;
			}

			// Optionally reverse the expectation for the first nested node
			if (
				checkOption(optionName, 'except', 'first-nested')
				&& rule === rule.parent.first
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Optionally reverse the expectation if a rule precedes this node
			if (
				checkOption(optionName, 'except', 'after-rule')
				&& rule.prev()
				&& (
					rule.prev().type === 'rule'
					|| (
						hasSharedLineCommentBefore(rule)
						&& rule.prev().prev()
						&& rule.prev().prev().type === 'rule'
					)
				)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			const hasEmptyLineBefore = hasEmptyLine(rule.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			if (expectEmptyLineBefore) {
				if (rule.raws.before.indexOf('\n') === -1) {
					rule.raws.before = `\n${rule.raws.before}`;
				}

				rule.raws.before = createEmptyLines(1) + rule.raws.before;
			} else {
				rule.raws.before = cleanEmptyLines(rule.raws.before);
			}
		});
	}

	if (
		!_.isUndefined(opts['at-rule-nested-empty-line-before'])
		&& !_.isNull(opts['at-rule-nested-empty-line-before'])
	) {
		let atRuleNestedEmptyLineBefore = opts['at-rule-nested-empty-line-before'];

		// Convert to common options format, e. g. `true` → `[true]`
		if (!_.isArray(atRuleNestedEmptyLineBefore)) {
			atRuleNestedEmptyLineBefore = [atRuleNestedEmptyLineBefore];
		}

		const optionName = 'at-rule-nested-empty-line-before';

		css.walkAtRules(function (atRule) {
			// Only attend to nested at-rules
			if (atRule.parent === css) {
				return;
			}

			// Return early if at-rule is to be ignored
			if (checkOption(optionName, 'ignoreAtRules', atRule.name)) {
				return;
			}

			// Optionally ignore the expectation if the node is blockless
			if (
				checkOption(optionName, 'ignore', 'blockless-after-blockless')
				&& isBlocklessAfterBlockless()
			) {
				return;
			}

			const previousNode = atRule.prev();

			// Optionally ignore the expection if the node is blockless
			// and following another blockless at-rule with the same name
			if (
				checkOption(optionName, 'ignore', 'blockless-after-same-name-blockless')
				&& isBlocklessAfterSameNameBlockless()
			) {
				return;
			}

			// Optionally ignore the expectation if a comment precedes this node
			if (
				checkOption(optionName, 'ignore', 'after-comment')
				&& hasNonSharedLineCommentBefore(atRule)
			) {
				return;
			}

			let expectEmptyLineBefore = atRuleNestedEmptyLineBefore[0];

			// Optionally reverse the expectation if any exceptions apply
			if (
				checkOption(optionName, 'except', 'first-nested')
				&& isFirstNested()
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			if (
				checkOption(optionName, 'except', 'blockless-after-blockless')
				&& isBlocklessAfterBlockless()
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			if (
				checkOption(optionName, 'except', 'blockless-after-same-name-blockless')
				&& isBlocklessAfterSameNameBlockless()
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			if (
				checkOption(optionName, 'except', 'after-same-name')
				&& isAfterSameName()
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			const hasEmptyLineBefore = hasEmptyLine(atRule.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			if (expectEmptyLineBefore) {
				if (atRule.raws.before.indexOf('\n') === -1) {
					atRule.raws.before = `\n${atRule.raws.before}`;
				}

				atRule.raws.before = createEmptyLines(1) + atRule.raws.before;
			} else {
				atRule.raws.before = cleanEmptyLines(atRule.raws.before);
			}

			function isBlocklessAfterBlockless() {
				return !hasBlock(atRule)
					&& atRule.prev()
					&& (
						(
							atRule.prev().type === 'atrule'
							&& !hasBlock(atRule.prev())
							&& !hasBlock(atRule)
						)
						|| (
							hasSharedLineCommentBefore(atRule)
							&& atRule.prev().prev()
							&& atRule.prev().prev().type === 'atrule'
							&& !hasBlock(atRule.prev().prev())
						)
					);
			}

			function isBlocklessAfterSameNameBlockless() {
				return !hasBlock(atRule)
					&& previousNode
					&& (
						(
							previousNode.type === 'atrule'
							&& previousNode.name === atRule.name
							&& !hasBlock(previousNode)
						)
						|| (
							hasSharedLineCommentBefore(atRule)
							&& previousNode.prev()
							&& previousNode.prev().type === 'atrule'
							&& previousNode.prev().name === atRule.name
							&& !hasBlock(previousNode.prev())
						)
					);
			}

			function isAfterSameName() {
				return previousNode
					&& (
						(
							previousNode.type === 'atrule'
							&& previousNode.name === atRule.name
						)
						|| (
							hasSharedLineCommentBefore(atRule)
							&& previousNode.prev()
							&& previousNode.prev().type === 'atrule'
							&& previousNode.prev().name === atRule.name
						)
					);
			}

			function isFirstNested() {
				return atRule === atRule.parent.first;
			}
		});
	}

	if (
		!_.isUndefined(opts['comment-empty-line-before'])
		&& !_.isNull(opts['comment-empty-line-before'])
	) {
		let commentEmptyLineBefore = opts['comment-empty-line-before'];

		// Convert to common options format, e. g. `true` → `[true]`
		if (!_.isArray(commentEmptyLineBefore)) {
			commentEmptyLineBefore = [commentEmptyLineBefore];
		}

		const optionName = 'comment-empty-line-before';

		css.walk(function (node) {
			// Process only rules and atrules with nodes
			if (isRuleWithNodes(node)) {
				node.walkComments((comment) => {
					// Optionally ignore stylelint commands
					if (
						comment.text.indexOf('stylelint-') === 0
						&& checkOption(optionName, 'ignore', 'stylelint-command')
					) {
						return;
					}

					// Optionally ignore newlines between comments
					const prev = comment.prev();

					if (
						prev
						&& prev.type === 'comment'
						&& checkOption(optionName, 'ignore', 'after-comment')
					) {
						return;
					}

					if (
						comment.raws.inline
						|| comment.inline
					) {
						return;
					}

					const before = comment.raws.before || '';

					// Ignore shared-line comments
					if (before.indexOf('\n') === -1) {
						return;
					}

					const hasEmptyLineBefore = hasEmptyLine(before);

					let expectEmptyLineBefore = commentEmptyLineBefore[0];

					// Optionally reverse the expectation if any exceptions apply
					if (
						checkOption(optionName, 'except', 'first-nested')
						&& comment === comment.parent.first
					) {
						expectEmptyLineBefore = !expectEmptyLineBefore;
					}

					// Return if the expectation is met
					if (expectEmptyLineBefore === hasEmptyLineBefore) {
						return;
					}

					if (expectEmptyLineBefore) {
						comment.raws.before = createEmptyLines(1) + comment.raws.before;
					} else {
						comment.raws.before = cleanEmptyLines(comment.raws.before);
					}
				});
			}
		});
	}

	function checkOption(primaryOption, secondaryOption, value) {
		const secondaryOptionValues = _.get(opts[primaryOption][1], secondaryOption);

		return _.includes(secondaryOptionValues, value);
	}
}
