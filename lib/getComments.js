/** @import { ChildNode } from 'postcss' */
/** @import { CommentData, DeclarationData, IndexedChildNode, IndexedComment } from './types.js' */

/**
 * @param {IndexedComment[]} comments
 * @param {ChildNode | undefined} previousNode
 * @param {IndexedChildNode} node
 * @param {number} [currentInitialIndex]
 * @returns {IndexedComment[]}
 */
// eslint-disable-next-line max-params
export function beforeNode(comments, previousNode, node, currentInitialIndex) {
	if (!previousNode || previousNode.type !== 'comment') {
		return comments;
	}

	if (
		!previousNode.raws.before ||
		(!previousNode.raws.before.includes('\n') && previousNode.prev())
	) {
		return comments;
	}

	let initialIndex = currentInitialIndex || node.initialIndex;

	const comment = Object.assign(previousNode, {
		position: node.position,
		initialIndex: initialIndex - 0.0001,
	});

	const newComments = [comment, ...comments];

	return beforeNode(newComments, previousNode.prev(), node, comment.initialIndex);
}

/**
 * @param {IndexedComment[]} comments
 * @param {ChildNode | undefined} nextNode
 * @param {IndexedChildNode} node
 * @param {number} [currentInitialIndex]
 * @returns {IndexedComment[]}
 */
// eslint-disable-next-line max-params
export function afterNode(comments, nextNode, node, currentInitialIndex) {
	if (!nextNode || nextNode.type !== 'comment') {
		return comments;
	}

	if (!nextNode.raws.before || nextNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || node.initialIndex;

	const comment = Object.assign(nextNode, {
		position: node.position,
		initialIndex: initialIndex + 0.0001,
	});

	return afterNode([...comments, comment], nextNode.next(), node, comment.initialIndex);
}

/**
 * @param {CommentData[]} comments
 * @param {ChildNode | undefined} previousNode
 * @param {DeclarationData} nodeData
 * @param {number} [currentInitialIndex]
 * @returns {CommentData[]}
 */
// eslint-disable-next-line max-params
export function beforeDeclaration(comments, previousNode, nodeData, currentInitialIndex) {
	if (!previousNode || previousNode.type !== 'comment') {
		return comments;
	}

	if (!previousNode.raws.before || !previousNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || nodeData.initialIndex;

	const commentData = {
		orderData: nodeData.orderData,
		node: previousNode,
		unprefixedName: nodeData.unprefixedName, // related property name for alphabetical order
		unspecifiedPropertiesPosition: nodeData.unspecifiedPropertiesPosition,
		initialIndex: initialIndex - 0.0001,
	};

	const newComments = [commentData, ...comments];

	return beforeDeclaration(newComments, previousNode.prev(), nodeData, commentData.initialIndex);
}

/**
 * @param {CommentData[]} comments
 * @param {ChildNode | undefined} nextNode
 * @param {DeclarationData} nodeData
 * @param {number} [currentInitialIndex]
 * @returns {CommentData[]}
 */
// eslint-disable-next-line max-params
export function afterDeclaration(comments, nextNode, nodeData, currentInitialIndex) {
	if (!nextNode || nextNode.type !== 'comment') {
		return comments;
	}

	if (!nextNode.raws.before || nextNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || nodeData.initialIndex;

	const commentData = {
		orderData: nodeData.orderData,
		node: nextNode,
		unprefixedName: nodeData.unprefixedName, // related property name for alphabetical order
		unspecifiedPropertiesPosition: nodeData.unspecifiedPropertiesPosition,
		initialIndex: initialIndex + 0.0001,
	};

	return afterDeclaration(
		[...comments, commentData],
		nextNode.next(),
		nodeData,
		commentData.initialIndex,
	);
}
