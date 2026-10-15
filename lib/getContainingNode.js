/** @import { ChildNode, Document, Root } from 'postcss' */

/**
 * @param {ChildNode} node
 * @returns {ChildNode | Root}
 */
export function getContainingNode(node) {
	if (node.type === 'rule' || node.type === 'atrule') {
		return node;
	}

	const parent = /** @type {(Root & { document?: Document }) | undefined} */ (node.parent);

	// postcss-styled-syntax: declarations are children of Root node
	if (parent?.type === 'root' && parent.raws.isRuleLike) {
		return parent;
	}

	// postcss-html `style` attributes: declarations are children of Root node
	if (parent?.document?.nodes?.some((item) => item.type === 'root')) {
		return parent;
	}

	return node;
}
