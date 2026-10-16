/** @import { ChildNode } from 'postcss' */
/** @import { CommentData, DeclarationData, IndexedChildNode, IndexedComment } from './types.js' */

// Comments are looked up by sibling index, because `node.prev()` and `node.next()` are O(n).

/**
 * @param {ChildNode[]} siblings
 * @param {number} index Index of `node` in `siblings`.
 * @param {IndexedChildNode} node
 * @returns {IndexedComment[]}
 */
export function beforeNode(siblings, index, node) {
	/** @type {IndexedComment[]} */
	const comments = [];
	let initialIndex = node.initialIndex;

	for (let i = index - 1; i >= 0; i--) {
		const previousNode = siblings[i];

		if (!previousNode || previousNode.type !== 'comment') {
			break;
		}

		if (!previousNode.raws.before || (!previousNode.raws.before.includes('\n') && i > 0)) {
			break;
		}

		initialIndex -= 0.0001;

		comments.push(
			Object.assign(previousNode, {
				position: node.position,
				initialIndex,
			}),
		);
	}

	return comments.reverse();
}

/**
 * @param {ChildNode[]} siblings
 * @param {number} index Index of `node` in `siblings`.
 * @param {IndexedChildNode} node
 * @returns {IndexedComment[]}
 */
export function afterNode(siblings, index, node) {
	/** @type {IndexedComment[]} */
	const comments = [];
	let initialIndex = node.initialIndex;

	for (let i = index + 1; i < siblings.length; i++) {
		const nextNode = siblings[i];

		if (!nextNode || nextNode.type !== 'comment') {
			break;
		}

		if (!nextNode.raws.before || nextNode.raws.before.includes('\n')) {
			break;
		}

		initialIndex += 0.0001;

		comments.push(
			Object.assign(nextNode, {
				position: node.position,
				initialIndex,
			}),
		);
	}

	return comments;
}

/**
 * @param {ChildNode[]} siblings
 * @param {number} index Index of the declaration in `siblings`.
 * @param {DeclarationData} nodeData
 * @returns {CommentData[]}
 */
export function beforeDeclaration(siblings, index, nodeData) {
	/** @type {CommentData[]} */
	const comments = [];
	let initialIndex = nodeData.initialIndex;

	for (let i = index - 1; i >= 0; i--) {
		const previousNode = siblings[i];

		if (!previousNode || previousNode.type !== 'comment') {
			break;
		}

		if (!previousNode.raws.before || !previousNode.raws.before.includes('\n')) {
			break;
		}

		initialIndex -= 0.0001;

		comments.push({
			orderData: nodeData.orderData,
			node: previousNode,
			unprefixedName: nodeData.unprefixedName, // related property name for alphabetical order
			unspecifiedPropertiesPosition: nodeData.unspecifiedPropertiesPosition,
			initialIndex,
		});
	}

	return comments.reverse();
}

/**
 * @param {ChildNode[]} siblings
 * @param {number} index Index of the declaration in `siblings`.
 * @param {DeclarationData} nodeData
 * @returns {CommentData[]}
 */
export function afterDeclaration(siblings, index, nodeData) {
	/** @type {CommentData[]} */
	const comments = [];
	let initialIndex = nodeData.initialIndex;

	for (let i = index + 1; i < siblings.length; i++) {
		const nextNode = siblings[i];

		if (!nextNode || nextNode.type !== 'comment') {
			break;
		}

		if (!nextNode.raws.before || nextNode.raws.before.includes('\n')) {
			break;
		}

		initialIndex += 0.0001;

		comments.push({
			orderData: nodeData.orderData,
			node: nextNode,
			unprefixedName: nodeData.unprefixedName, // related property name for alphabetical order
			unspecifiedPropertiesPosition: nodeData.unspecifiedPropertiesPosition,
			initialIndex,
		});
	}

	return comments;
}
