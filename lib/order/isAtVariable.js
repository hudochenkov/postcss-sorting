/** @import { SortableChildNode } from '../types.js' */

/**
 * Check whether a node is an at-variable (Less)
 *
 * @param {SortableChildNode} node
 * @returns {boolean}
 */
export function isAtVariable(node) {
	return node.type === 'atrule' && Boolean(node.variable);
}
