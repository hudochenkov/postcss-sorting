'use strict';

const _ = require('lodash');

function getNodeLine(node) {
	return _.get(node, 'source.start.line');
}

module.exports = function getPreviousNonSharedLineCommentNode(node) {
	if (_.isUndefined(node)) {
		return undefined; // eslint-disable-line no-undefined
	}

	const previousNode = node.prev();

	if (_.get(previousNode, 'type') !== 'comment') {
		return previousNode;
	}

	if (
		getNodeLine(node) === getNodeLine(previousNode)
		|| (!_.isUndefined(previousNode) && getNodeLine(previousNode) === getNodeLine(previousNode.prev()))
	) {
		return getPreviousNonSharedLineCommentNode(previousNode);
	}

	return previousNode;
};
