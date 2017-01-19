'use strict';

const _ = require('lodash');
const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const getNextNonSharedLineCommentNode = require('./getNextNonSharedLineCommentNode');

function nodesShareLines(a, b) {
	return _.get(a, 'source.start.line') === _.get(b, 'source.start.line');
}

module.exports = function isSharedLineComment(node) {
	if (node.type !== 'comment') {
		return false;
	}

	const previousNonSharedLineCommentNode = getPreviousNonSharedLineCommentNode(node);

	if (nodesShareLines(node, previousNonSharedLineCommentNode)) {
		return true;
	}

	const nextNonSharedLineCommentNode = getNextNonSharedLineCommentNode(node);

	if (nodesShareLines(node, nextNonSharedLineCommentNode)) {
		return true;
	}

	const parentNode = node.parent;

	if (
		!_.isUndefined(parentNode)
		&& parentNode.type !== 'root'
		&& parentNode.source.start.line === node.source.start.line
	) {
		return true;
	}

	return false;
};
