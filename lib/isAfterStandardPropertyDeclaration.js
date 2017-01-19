'use strict';

const _ = require('lodash');
const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const isStandardSyntaxDeclaration = require('./isStandardSyntaxDeclaration');
const isCustomProperty = require('./isCustomProperty');

module.exports = function (node) {
	const prevNode = getPreviousNonSharedLineCommentNode(node);

	return prevNode !== undefined
		&& prevNode.type === 'decl'
		&& isStandardSyntaxDeclaration(prevNode)
		&& !isCustomProperty(_.get(prevNode, 'prop', ''));
};
