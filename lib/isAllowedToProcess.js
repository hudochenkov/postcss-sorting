const atRuleExcludes = ['function', 'if', 'else', 'for', 'each', 'while'];

module.exports = function isAllowedToProcess(node) {
	if (node.type === 'atrule' && atRuleExcludes.includes(node.name)) {
		return false;
	}

	if (!node?.nodes?.length) {
		return false;
	}

	// postcss-styled-syntax: Interpolations at the end of node
	if (node.raws.after?.includes('${')) {
		return false;
	}

	// postcss-styled-syntax: Interpolations among children of a node
	if (node.nodes.some((item) => item.raws.before.includes('${'))) {
		return false;
	}

	// @stylelint/postcss-css-in-js only
	if (node.nodes.some((item) => item.type === 'literal')) {
		return false;
	}

	return true;
};
