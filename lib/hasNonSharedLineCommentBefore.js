'use strict';

module.exports = function hasNonSharedLineCommentBefore(node) {
	const prevNode = node.prev();

	return prevNode
		&& prevNode.type === 'comment'
		&& prevNode.raws.before
		&& (/[\n\r]/).test(prevNode.raws.before);
};
