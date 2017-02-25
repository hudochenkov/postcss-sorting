'use strict';

const checkOption = require('../checkOption');
const cleanEmptyLines = require('../cleanEmptyLines');
const createEmptyLines = require('../createEmptyLines');
const getPreviousNonSharedLineCommentNode = require('../getPreviousNonSharedLineCommentNode');
const hasEmptyLine = require('../hasEmptyLine');
const isAfterCommentLine = require('../isAfterCommentLine');
const isDollarVariable = require('../isDollarVariable');
const isFirstNested = require('../isFirstNested');
const isSingleLineBlock = require('../isSingleLineBlock');

module.exports = function (css, opts) {
	const optionName = 'dollar-variable-empty-line-before';

	css.walkDecls(function (decl) {
		const prop = decl.prop;
		const parent = decl.parent;

		if (!isDollarVariable(prop)) {
			return;
		}

		// Optionally ignore the node if a comment precedes it
		if (
			checkOption(opts, optionName, 'ignore', 'after-comment')
			&& isAfterCommentLine(decl)
		) {
			return;
		}

		// Optionally ignore nodes inside single-line blocks
		if (
			checkOption(opts, optionName, 'ignore', 'inside-single-line-block')
			&& isSingleLineBlock(parent)
		) {
			return;
		}

		let expectEmptyLineBefore = opts['dollar-variable-empty-line-before'][0];

		// Optionally reverse the expectation for the first nested node
		if (
			checkOption(opts, optionName, 'except', 'first-nested')
			&& isFirstNested(decl)
		) {
			expectEmptyLineBefore = !expectEmptyLineBefore;
		}

		// Optionally reverse the expectation if a comment precedes this node
		if (
			checkOption(opts, optionName, 'except', 'after-comment')
			&& isAfterCommentLine(decl)
		) {
			expectEmptyLineBefore = !expectEmptyLineBefore;
		}

		// Optionally reverse the expectation if a dollar variable precedes this node
		const prevNode = getPreviousNonSharedLineCommentNode(decl);

		if (
			checkOption(opts, optionName, 'except', 'after-dollar-variable')
			&& prevNode
			&& prevNode.prop
			&& isDollarVariable(prevNode.prop)
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
};
