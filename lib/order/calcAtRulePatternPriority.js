/** @import { AtRulePattern, AtRuleTarget } from '../types.js' */

/**
 * @param {AtRulePattern} pattern
 * @param {AtRuleTarget} node
 * @returns {number}
 */
export function calcAtRulePatternPriority(pattern, node) {
	// 0 — it pattern doesn't match
	// 1 — pattern without `name` and `hasBlock`
	// 10010 — pattern match `hasBlock`
	// 10100 — pattern match `name`
	// 20110 — pattern match `name` and `hasBlock`
	// 21100 — patter match `name` and `parameter`
	// 31110 — patter match `name`, `parameter`, and `hasBlock`

	let priority = 0;

	// match `hasBlock`
	if (pattern.hasBlock !== undefined && node.hasBlock === pattern.hasBlock) {
		priority += 10;
		priority += 10000;
	}

	// match `name`
	if (pattern.name !== undefined && node.name === pattern.name) {
		priority += 100;
		priority += 10000;
	}

	// match `name`
	if (
		pattern.parameter !== undefined &&
		node.parameter !== undefined &&
		pattern.parameter.test(node.parameter)
	) {
		priority += 1100;
		priority += 10000;
	}

	// doesn't have `name` and `hasBlock`
	if (
		pattern.hasBlock === undefined &&
		pattern.name === undefined &&
		pattern.parameter === undefined
	) {
		priority = 1;
	}

	// patter has `name` and `hasBlock`, but it doesn't match both properties
	if (pattern.hasBlock !== undefined && pattern.name !== undefined && priority < 20000) {
		priority = 0;
	}

	// patter has `name` and `parameter`, but it doesn't match both properties
	if (pattern.name !== undefined && pattern.parameter !== undefined && priority < 21100) {
		priority = 0;
	}

	// patter has `name`, `parameter`, and `hasBlock`, but it doesn't match all properties
	if (
		pattern.name !== undefined &&
		pattern.parameter !== undefined &&
		pattern.hasBlock !== undefined &&
		priority < 30000
	) {
		priority = 0;
	}

	return priority;
}
