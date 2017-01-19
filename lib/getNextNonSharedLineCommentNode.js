'use strict';

const _ = require('lodash');

function getNodeLine(node) {
	return _.get(node, 'source.start.line');
}

module.exports = function getNextNonSharedLineCommentNode(node) {
	if (_.isUndefined(node)) {
		return undefined; // eslint-disable-line no-undefined
	}

	const nextNode = node.next();

	if (_.get(nextNode, 'type') !== 'comment') {
		return nextNode;
	}

	if (
		getNodeLine(node) === getNodeLine(nextNode)
		|| (!_.isUndefined(nextNode) && getNodeLine(nextNode) === getNodeLine(nextNode.next()))
	) {
		return getNextNonSharedLineCommentNode(nextNode);
	}

	return nextNode;
};
