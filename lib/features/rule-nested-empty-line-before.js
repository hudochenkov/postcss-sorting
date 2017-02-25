'use strict';

const _ = require('lodash');

const checkOption = require('../checkOption');
const cleanEmptyLines = require('../cleanEmptyLines');
const createEmptyLines = require('../createEmptyLines');
const getPreviousNonSharedLineCommentNode = require('../getPreviousNonSharedLineCommentNode');
const hasEmptyLine = require('../hasEmptyLine');
const isAfterCommentLine = require('../isAfterCommentLine');
const isFirstNested = require('../isFirstNested');
const isSingleLineString = require('../isSingleLineString');
const isStandardSyntaxRule = require('../isStandardSyntaxRule');

module.exports = function (css, opts) {
	const ruleNestedEmptyLineBefore = opts['rule-nested-empty-line-before'];
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
			checkOption(opts, optionName, 'ignore', 'after-comment')
			&& isAfterCommentLine(rule)
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
			checkOption(opts, optionName, 'except', 'first-nested')
			&& isFirstNested(rule)
		) {
			expectEmptyLineBefore = !expectEmptyLineBefore;
		}

		// Optionally reverse the expectation if a rule precedes this node
		if (
			checkOption(opts, optionName, 'except', 'after-rule')
			&& _.get(getPreviousNonSharedLineCommentNode(rule), 'type') === 'rule'
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
};
