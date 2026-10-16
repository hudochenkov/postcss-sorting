/** @import { ChildNode } from 'postcss' */
/** @import { ContainerNode } from './types.js' */

/**
 * @param {ContainerNode} node
 * @param {ChildNode[]} children
 */
export function replaceChildren(node, children) {
	const current = /** @type {ChildNode[]} */ (node.nodes);

	// Appending to a Root rewrites `raws.before`, so only skip the rewrite for other containers.
	if (
		node.type !== 'root' &&
		current.length === children.length &&
		current.every((child, index) => child === children[index])
	) {
		return;
	}

	node.removeAll();
	node.append(children);
}
