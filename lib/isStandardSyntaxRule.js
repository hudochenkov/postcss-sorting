'use strict';

const _ = require('lodash');

/**
 * Check whether a Node is a standard rule
 */
module.exports = function isStandardSyntaxRule(rule) {
	// Get full selector
	const selector = _.get(rule, 'raws.selector.raw', rule.selector);

	// Custom property set (e.g. --custom-property-set: {})
	if (isCustomPropertySet(rule)) {
		return false;
	}

	// Called Less mixin (e.g. a { .mixin() })
	if (rule.ruleWithoutBody) {
		return false;
	}

	// Less detached rulesets
	if (selector.slice(0, 1) === '@' && selector.slice(-1) === ':') {
		return false;
	}

	// Ignore mixin or &:extend rule
	// https://github.com/webschik/postcss-less/blob/master/lib/less-parser.js#L52
	if (rule.params && rule.params[0]) {
		return false;
	}

	// Non-outputting Less mixin definition (e.g. .mixin() {})
	if (_.endsWith(selector, ')') && !_.includes(selector, ':')) {
		return false;
	}

	// Ignore Scss nested properties
	if (selector.slice(-1) === ':') {
		return false;
	}

	return true;
};

/**
 * Check whether a Node is a custom property set
 */
function isCustomPropertySet(node) {
	const selector = _.get(node, 'raws.selector.raw', node.selector);

	return node.type === 'rule' && hasBlock(node) && selector.slice(0, 2) === '--' && selector.slice(-1) === ':';
}

/**
 * Check if a statement has an block (empty or otherwise).
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {boolean} True if `statement` has a block (empty or otherwise)
 */
function hasBlock(statement) {
	return !_.isUndefined(statement.nodes);
}
