/** @import { RulePattern, RuleTarget } from '../types.js' */

/**
 * @param {RulePattern} pattern
 * @param {RuleTarget} node
 * @returns {number}
 */
export function calcRulePatternPriority(pattern, node) {
	// 0 — it pattern doesn't match
	// 1 — pattern without `selector`
	// 2 — pattern match `selector`

	let priority = 0;

	// doesn't have `selector`
	if (pattern.selector === undefined) {
		priority = 1;
	}

	// match `selector`
	if (pattern.selector !== undefined && pattern.selector.test(node.selector)) {
		priority = 2;
	}

	return priority;
}
