/** @import { ChildNode } from 'postcss' */
/** @import { IndexedChildNode } from '../types.js' */

/**
 * @param {ChildNode} node
 * @param {number} index
 * @param {IndexedChildNode[]} processedNodes Mutated: an unclaimed comment is appended.
 */
export function processLastComments(node, index, processedNodes) {
	if (node.type === 'comment' && !node.hasOwnProperty('position')) {
		processedNodes.push(Object.assign(node, { position: Infinity, initialIndex: index }));
	}
}
