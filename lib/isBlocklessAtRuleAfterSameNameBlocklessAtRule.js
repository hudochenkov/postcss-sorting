'use strict';

const isBlocklessAtRuleAfterBlocklessAtRule = require('./isBlocklessAtRuleAfterBlocklessAtRule');
const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');

module.exports = function (atRule) {
	if (!isBlocklessAtRuleAfterBlocklessAtRule(atRule)) {
		return false;
	}

	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	return previousNode !== undefined
		&& previousNode.name === atRule.name;
};
