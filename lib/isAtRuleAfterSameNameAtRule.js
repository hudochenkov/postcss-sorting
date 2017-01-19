'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');

module.exports = function (atRule) {
	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	return previousNode !== undefined
		&& previousNode.type === 'atrule'
		&& previousNode.name === atRule.name;
};
