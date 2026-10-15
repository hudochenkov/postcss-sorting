/** @import { ChildNode } from 'postcss' */
/** @import { IndexedChildNode } from '../types.js' */

/**
 * @param {ChildNode} node
 * @param {number} index
 * @param {IndexedChildNode[]} processedNodes
 * @returns {IndexedChildNode[]}
 */
export function processLastComments(node, index, processedNodes) {
	if (node.type === 'comment' && !node.hasOwnProperty('position')) {
		const comment = Object.assign(node, { position: Infinity, initialIndex: index });

		return [...processedNodes, comment];
	}

	return processedNodes;
}
