'use strict';

const hasBlock = require('./hasBlock');

/**
 * Check if a string is a single line (i.e. does not contain
 * any newline characters).
 *
 * @param {string} input
 * @return {boolean}
 */
module.exports = function isSingleLineBlock(input) {
	return !(/[\n\r]/).test(blockString(input));
};

/**
 * Return a CSS statement's block -- the string that starts and `{` and ends with `}`.
 *
 * If the statement has no block (e.g. `@import url(foo.css);`),
 * return undefined.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {string|undefined}
 */
function blockString(statement) {
	if (!hasBlock(statement)) {
		return false;
	}

	return rawNodeString(statement).slice(beforeBlockString(statement).length);
}

function beforeBlockString(statement, options) {
	options = options || {};

	let result = '';
	let rule;
	let atRule;

	if (statement.type === 'rule') {
		rule = statement;
	}

	if (statement.type === 'atrule') {
		atRule = statement;
	}

	if (!rule && !atRule) {
		return result;
	}

	const before = (statement.raws.before || '');

	if (!options.noRawBefore) {
		result += before;
	}

	if (rule) {
		result += rule.selector;
	}

	if (atRule) {
		result += `@${atRule.name}${atRule.raws.afterName || ''}${atRule.params}`;
	}

	const between = statement.raws.between;

	if (typeof between !== 'undefined') {
		result += between;
	}

	return result;
}

/**
 * Stringify PostCSS node including its raw "before" string.
 */
function rawNodeString(node) {
	let result = '';

	if (node.raws.before) {
		result += node.raws.before;
	}

	result += node.toString();

	return result;
}
