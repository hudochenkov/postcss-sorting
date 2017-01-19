'use strict';

const hasBlock = require('./hasBlock');
const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');

module.exports = function (atRule) {
	if (atRule.type !== 'atrule') {
		return false;
	}

	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	return previousNode !== undefined
		&& previousNode.type === 'atrule'
		&& !hasBlock(previousNode)
		&& !hasBlock(atRule);
};
