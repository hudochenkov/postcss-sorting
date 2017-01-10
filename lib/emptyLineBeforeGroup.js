'use strict';

const _ = require('lodash');
const createEmptyLines = require('./createEmptyLines');
const countEmptyLines = require('./countEmptyLines');
const cleanEmptyLines = require('./cleanEmptyLines');

module.exports = function emptyLineBeforeGroup(item, index, declarations) {
	let prevItem = declarations[index - 1];

	// Ignore shared-line comment and use node before it
	if (!_.isUndefined(prevItem) && prevItem.node.type === 'comment' && prevItem.node.raws.before && !(/[\n\r]/).test(prevItem.node.raws.before)) {
		prevItem = declarations[index - 2];
	}

	if (
		_.isUndefined(prevItem) ||
		item.node.type !== 'decl' ||
		prevItem.node.type !== 'decl' ||
		_.isNull(item.orderData) ||
		_.isNull(prevItem.orderData) ||
		_.isUndefined(item.orderData) ||
		_.isUndefined(prevItem.orderData) ||
		_.isUndefined(item.orderData.groupIndex) ||
		_.isUndefined(prevItem.orderData.groupIndex) ||
		item.orderData.groupIndex === prevItem.orderData.groupIndex ||
		_.isUndefined(item.orderData.emptyLineBefore)
	) {
		return;
	}

	if (item.orderData.emptyLineBefore) {
		// Only add empty line if there is no empty line
		if (countEmptyLines(item.node.raws.before) < 1) {
			item.node.raws.before = createEmptyLines(1) + item.node.raws.before;
		}
	} else {
		item.node.raws.before = cleanEmptyLines(item.node.raws.before);
	}
};
