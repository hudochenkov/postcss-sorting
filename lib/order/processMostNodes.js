import { getOrderData } from './getOrderData.js';
import { beforeNode, afterNode } from '../getComments.js';

/** @import { ChildNode } from 'postcss' */
/** @import { ExpectedOrder, IndexedChildNode } from '../types.js' */

/**
 * @param {ChildNode} node
 * @param {number} index
 * @param {ExpectedOrder} order
 * @param {IndexedChildNode[]} processedNodes
 * @returns {IndexedChildNode[]}
 */
// eslint-disable-next-line max-params
export function processMostNodes(node, index, order, processedNodes) {
	if (node.type === 'comment') {
		return processedNodes;
	}

	const nodeOrderData = getOrderData(order, node);

	const indexedNode = Object.assign(node, {
		position: nodeOrderData && nodeOrderData.position ? nodeOrderData.position : Infinity,
		initialIndex: index,
	});

	// If comment on separate line before node, use node's indexes for comment
	const commentsBefore = beforeNode([], node.prev(), indexedNode);

	// If comment on same line with the node and node, use node's indexes for comment
	const commentsAfter = afterNode([], node.next(), indexedNode);

	return [...processedNodes, ...commentsBefore, indexedNode, ...commentsAfter];
}
