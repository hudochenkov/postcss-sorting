const atRuleExcludes = ['function', 'if', 'else', 'for', 'each', 'while'];

module.exports = function isRuleWithNodes(node) {
	return (
		(node.type === 'rule' || node.type === 'atrule') &&
		node.nodes &&
		node.nodes.length &&
		atRuleExcludes.indexOf(node.name) === -1
	);
};
