import { getOrderData } from './getOrderData.js';
import { beforeNode, afterNode } from '../getComments.js';

// eslint-disable-next-line max-params
export function processMostNodes(node, index, order, processedNodes) {
	if (node.type === 'comment') {
		return processedNodes;
	}

	const nodeOrderData = getOrderData(order, node);

	node.position = nodeOrderData && nodeOrderData.position ? nodeOrderData.position : Infinity;
	node.initialIndex = index;

	// If comment on separate line before node, use node's indexes for comment
	const commentsBefore = beforeNode([], node.prev(), node);

	// If comment on same line with the node and node, use node's indexes for comment
	const commentsAfter = afterNode([], node.next(), node);

	return [...processedNodes, ...commentsBefore, node, ...commentsAfter];
}
