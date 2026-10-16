import { getOrderData } from './getOrderData.js';
import { beforeNode, afterNode } from '../getComments.js';

/** @import { ChildNode } from 'postcss' */
/** @import { ContainerNode, ExpectedOrder, IndexedChildNode } from '../types.js' */

/**
 * @param {ChildNode} node
 * @param {number} index
 * @param {ExpectedOrder} order
 * @param {IndexedChildNode[]} processedNodes Mutated: the node and its comments are appended.
 */
// eslint-disable-next-line max-params
export function processMostNodes(node, index, order, processedNodes) {
	if (node.type === 'comment') {
		return;
	}

	const nodeOrderData = getOrderData(order, node);

	const indexedNode = Object.assign(node, {
		position: nodeOrderData && nodeOrderData.position ? nodeOrderData.position : Infinity,
		initialIndex: index,
	});

	// If comment on separate line before node, use node's indexes for comment
	const siblings = /** @type {ChildNode[]} */ (/** @type {ContainerNode} */ (node.parent).nodes);
	const commentsBefore = beforeNode(siblings, index, indexedNode);

	// If comment on same line with the node and node, use node's indexes for comment
	const commentsAfter = afterNode(siblings, index, indexedNode);

	processedNodes.push(...commentsBefore, indexedNode, ...commentsAfter);
}
