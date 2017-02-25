'use strict';

const checkOption = require('../checkOption');
const cleanEmptyLines = require('../cleanEmptyLines');
const createEmptyLines = require('../createEmptyLines');
const hasEmptyLine = require('../hasEmptyLine');
const isAfterCommentLine = require('../isAfterCommentLine');
const isRuleWithNodes = require('../isRuleWithNodes');

module.exports = function (css, opts) {
	const optionName = 'comment-empty-line-before';

	css.walk(function (node) {
		// Process only rules and atrules with nodes
		if (isRuleWithNodes(node)) {
			node.walkComments((comment) => {
				// Optionally ignore stylelint commands
				if (
					checkOption(opts, optionName, 'ignore', 'stylelint-command')
					&& comment.text.indexOf('stylelint-') === 0
				) {
					return;
				}

				if (
					checkOption(opts, optionName, 'ignore', 'after-comment')
					&& isAfterCommentLine(comment)
				) {
					return;
				}

				// Ignore inline comments in custom syntaxes
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

				let expectEmptyLineBefore = opts['comment-empty-line-before'][0];

				// Optionally reverse the expectation if any exceptions apply
				if (
					checkOption(opts, optionName, 'except', 'first-nested')
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
};
