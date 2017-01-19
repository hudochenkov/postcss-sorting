'use strict';

module.exports = function (statement) {
	const parentNode = statement.parent;

	return parentNode !== undefined
		&& parentNode.type !== 'root'
		&& statement === parentNode.first;
};
