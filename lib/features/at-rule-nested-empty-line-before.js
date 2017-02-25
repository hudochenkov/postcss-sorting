'use strict';

const checkOption = require('../checkOption');
const cleanEmptyLines = require('../cleanEmptyLines');
const createEmptyLines = require('../createEmptyLines');
const hasEmptyLine = require('../hasEmptyLine');
const isAfterCommentLine = require('../isAfterCommentLine');
const isAtRuleAfterSameNameAtRule = require('../isAtRuleAfterSameNameAtRule');
const isBlocklessAtRuleAfterBlocklessAtRule = require('../isBlocklessAtRuleAfterBlocklessAtRule');
const isBlocklessAtRuleAfterSameNameBlocklessAtRule = require('../isBlocklessAtRuleAfterSameNameBlocklessAtRule');
const isFirstNested = require('../isFirstNested');

module.exports = function (css, opts) {
	const optionName = 'at-rule-nested-empty-line-before';

	css.walkAtRules(function (atRule) {
		// Only attend to nested at-rules
		if (atRule.parent === css) {
			return;
		}

		// Return early if at-rule is to be ignored
		if (checkOption(opts, optionName, 'ignoreAtRules', atRule.name)) {
			return;
		}

		// Optionally ignore the expectation if the node is blockless
		if (
			checkOption(opts, optionName, 'ignore', 'blockless-after-blockless')
			&& isBlocklessAtRuleAfterBlocklessAtRule(atRule)
		) {
			return;
		}

		// Optionally ignore the expection if the node is blockless
		// and following another blockless at-rule with the same name
		if (
			checkOption(opts, optionName, 'ignore', 'blockless-after-same-name-blockless')
			&& isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule)
		) {
			return;
		}

		// Optionally ignore the expectation if a comment precedes this node
		if (
			checkOption(opts, optionName, 'ignore', 'after-comment')
			&& isAfterCommentLine(atRule)
		) {
			return;
		}

		let expectEmptyLineBefore = opts['at-rule-nested-empty-line-before'][0];

		// Optionally reverse the expectation if any exceptions apply
		if (
			checkOption(opts, optionName, 'except', 'first-nested')
			&& isFirstNested(atRule)
		) {
			expectEmptyLineBefore = !expectEmptyLineBefore;
		}

		if (
			checkOption(opts, optionName, 'except', 'blockless-after-blockless')
			&& isBlocklessAtRuleAfterBlocklessAtRule(atRule)
		) {
			expectEmptyLineBefore = !expectEmptyLineBefore;
		}

		if (
			checkOption(opts, optionName, 'except', 'blockless-after-same-name-blockless')
			&& isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule)
		) {
			expectEmptyLineBefore = !expectEmptyLineBefore;
		}

		if (
			checkOption(opts, optionName, 'except', 'after-same-name')
			&& isAtRuleAfterSameNameAtRule(atRule)
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
	});
};
