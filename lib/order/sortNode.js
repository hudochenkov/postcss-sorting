import { createExpectedOrder } from './createExpectedOrder.js';
import { isAllowedToProcess } from '../isAllowedToProcess.js';
import { processLastComments } from './processLastComments.js';
import { processMostNodes } from './processMostNodes.js';
import { replaceChildren } from '../replaceChildren.js';
import { sortByIndexes } from './sortByIndexes.js';

/** @import { ChildNode, Root } from 'postcss' */
/** @import { ContainerNode, ExpectedOrder, IndexedChildNode, OrderOptionItem } from '../types.js' */

// Keyed by options array identity, so mutating an options array after its first use is not picked up.
/** @type {WeakMap<OrderOptionItem[], ExpectedOrder>} */
const expectedOrderCache = new WeakMap();

/**
 * @param {OrderOptionItem[]} optsOrder
 * @returns {ExpectedOrder}
 */
function getExpectedOrder(optsOrder) {
	let expectedOrder = expectedOrderCache.get(optsOrder);

	if (!expectedOrder) {
		expectedOrder = createExpectedOrder(optsOrder);
		expectedOrderCache.set(optsOrder, expectedOrder);
	}

	return expectedOrder;
}

/**
 * @param {ChildNode | Root} node
 * @param {OrderOptionItem[]} optsOrder
 */
export function sortNode(node, optsOrder) {
	if (!isAllowedToProcess(node)) {
		return;
	}

	// isAllowedToProcess guarantees the node has children
	const container = /** @type {ContainerNode} */ (node);

	const expectedOrder = getExpectedOrder(optsOrder);

	// Nodes for sorting
	/** @type {IndexedChildNode[]} */
	const processed = [];

	// Add indexes to nodes
	container.each((childNode, index) => {
		processMostNodes(childNode, index, expectedOrder, processed);
	});

	// Add last comments in the rule. Need this because last comments are not belonging to anything
	container.each((childNode, index) => {
		processLastComments(childNode, index, processed);
	});

	// Sort declarations saved for sorting
	processed.sort(sortByIndexes);

	// Enforce semicolon for the last node
	container.raws.semicolon = true;

	// Replace rule content with sorted one
	replaceChildren(container, processed);
}
