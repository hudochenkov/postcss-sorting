import { createExpectedPropertiesOrder } from './createExpectedPropertiesOrder.js';
import { beforeDeclaration, afterDeclaration } from '../getComments.js';
import { getPropertiesOrderData } from './getPropertiesOrderData.js';
import { isCustomProperty } from '../isCustomProperty.js';
import { isAllowedToProcess } from '../isAllowedToProcess.js';
import { isStandardSyntaxProperty } from '../isStandardSyntaxProperty.js';
import { sortDeclarations } from './sortDeclarations.js';
import { sortDeclarationsAlphabetically } from './sortDeclarationsAlphabetically.js';
import * as vendor from './vendor.js';

/** @import { ChildNode, Declaration, Root } from 'postcss' */
/**
 * @import {
 * 	CommentData,
 * 	ContainerNode,
 * 	DeclarationData,
 * 	PropertiesOrderOption,
 * 	PropertyData,
 * 	UnspecifiedPropertiesPositionOption,
 * } from '../types.js'
 */

/**
 * @param {ChildNode} childNode
 * @returns {childNode is Declaration}
 */
function isSortableDeclaration(childNode) {
	return (
		childNode.type === 'decl' &&
		isStandardSyntaxProperty(childNode.prop) &&
		!isCustomProperty(childNode.prop)
	);
}

/**
 * @param {string} propName
 * @returns {string}
 */
function getNormalizedPropName(propName) {
	let unprefixedPropName = vendor.unprefixed(propName).toLowerCase();

	// Hack to allow -moz-osx-font-smoothing to be understood
	// just like -webkit-font-smoothing
	if (unprefixedPropName.indexOf('osx-') === 0) {
		return unprefixedPropName.slice(4);
	}

	return unprefixedPropName;
}

/**
 * @param {Set<number>} processedIndices
 * @param {number} index
 * @param {CommentData[]} commentsBefore
 * @param {CommentData[]} commentsAfter
 */
// eslint-disable-next-line max-params
function addCommentIndices(processedIndices, index, commentsBefore, commentsAfter) {
	if (commentsBefore.length) {
		for (let i = 1; i <= commentsBefore.length; i++) {
			processedIndices.add(index - i);
		}
	}

	if (commentsAfter.length) {
		for (let i = 1; i <= commentsAfter.length; i++) {
			processedIndices.add(index + i);
		}
	}
}

/**
 * @param {ContainerNode} node
 * @param {ChildNode[]} children
 */
function replaceChildren(node, children) {
	node.removeAll();
	node.append(children);
}

/**
 * @param {ChildNode | Root} node
 * @param {{ order: PropertiesOrderOption, unspecifiedPropertiesPosition: UnspecifiedPropertiesPositionOption }} options
 */
export function sortNodeProperties(node, { order, unspecifiedPropertiesPosition }) {
	if (!isAllowedToProcess(node, { ignoreInterpolations: true })) {
		return;
	}

	// isAllowedToProcess guarantees the node has children
	const container = /** @type {ContainerNode} */ (node);

	const isAlphabetical = order === 'alphabetical';
	let expectedOrder = isAlphabetical ? null : createExpectedPropertiesOrder(order);

	/** @type {PropertyData[]} */
	const declarations = [];
	/** @type {Set<number>} */
	const processedIndices = new Set();
	/** @type {Map<number, DeclarationData>} */
	const propDataByIndex = new Map();

	container.each((childNode, index) => {
		if (!isSortableDeclaration(childNode)) {
			return;
		}

		let unprefixedPropName = getNormalizedPropName(childNode.prop);
		/** @type {DeclarationData} */
		let propData = {
			name: childNode.prop,
			unprefixedName: unprefixedPropName,
			orderData: expectedOrder
				? getPropertiesOrderData(expectedOrder, unprefixedPropName)
				: undefined,
			node: childNode,
			initialIndex: index,
			unspecifiedPropertiesPosition,
		};

		processedIndices.add(index);
		propDataByIndex.set(index, propData);

		// If comment on separate line before node, use node's indexes for comment
		let commentsBefore = beforeDeclaration([], childNode.prev(), propData);

		// If comment on same line with the node and node, use node's indexes for comment
		let commentsAfter = afterDeclaration([], childNode.next(), propData);

		addCommentIndices(processedIndices, index, commentsBefore, commentsAfter);
		declarations.push(...commentsBefore, propData, ...commentsAfter);
	});

	if (isAllowedToProcess(container)) {
		if (isAlphabetical) {
			declarations.sort(sortDeclarationsAlphabetically);
		} else {
			declarations.sort(sortDeclarations);
		}

		/** @type {ChildNode[]} */
		let allRuleNodes = [];
		let foundDeclarations = false;

		container.each((childNode, index) => {
			if (processedIndices.has(index)) {
				if (!foundDeclarations) {
					foundDeclarations = true;

					declarations.forEach((item) => {
						allRuleNodes.push(item.node);
					});
				}
			} else {
				allRuleNodes.push(childNode);
			}
		});

		replaceChildren(container, allRuleNodes);

		return;
	}

	/** @type {ChildNode[]} */
	let allRuleNodes = [];
	/** @type {DeclarationData[]} */
	let currentGroup = [];

	function sortGroup() {
		const originalFirst = currentGroup[0]?.node;

		if (!originalFirst) {
			return;
		}

		const barrierRaws = originalFirst.raws.before;

		if (isAlphabetical) {
			currentGroup.sort(sortDeclarationsAlphabetically);
		} else {
			currentGroup.sort(sortDeclarations);
		}

		const newFirst = currentGroup[0]?.node;

		if (newFirst && newFirst !== originalFirst) {
			const temp = newFirst.raws.before;

			newFirst.raws.before = barrierRaws;
			originalFirst.raws.before = temp;
		}

		currentGroup.forEach((item) => {
			allRuleNodes.push(item.node);
		});

		currentGroup = [];
	}

	container.each((childNode, index) => {
		const data = propDataByIndex.get(index);

		if (data && childNode.type === 'decl') {
			if (childNode.raws.before && childNode.raws.before.includes('${')) {
				sortGroup();
			}

			currentGroup.push(data);
		} else {
			sortGroup();
			allRuleNodes.push(childNode);
		}
	});

	sortGroup();
	replaceChildren(container, allRuleNodes);
}
