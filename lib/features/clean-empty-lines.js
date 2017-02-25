'use strict';

const cleanEmptyLines = require('../cleanEmptyLines');
const isRuleWithNodes = require('../isRuleWithNodes');

module.exports = function (css, opts) {
	if (opts['clean-empty-lines'] !== true) {
		return;
	}

	css.walk(function (node) {
		if (isRuleWithNodes(node)) {
			// Remove empty lines before every node
			node.each(function (childNode) {
				if (childNode.raws.before) {
					childNode.raws.before = cleanEmptyLines(childNode.raws.before);
				}
			});

			// Remove empty lines after the last node
			if (node.raws.after) {
				node.raws.after = cleanEmptyLines(node.raws.after);
			}
		}
	});
};
