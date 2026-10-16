import { createExpectedOrder } from './createExpectedOrder.js';
import { isAllowedToProcess } from '../isAllowedToProcess.js';
import { processLastComments } from './processLastComments.js';
import { processMostNodes } from './processMostNodes.js';
import { sortByIndexes } from './sortByIndexes.js';

/** @import { ChildNode, Root } from 'postcss' */
/** @import { ContainerNode, IndexedChildNode, OrderOptionItem } from '../types.js' */

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

	const expectedOrder = createExpectedOrder(optsOrder);

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
	container.removeAll();
	container.append(processed);
}
