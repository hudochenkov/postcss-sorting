'use strict';

const _ = require('lodash');
const createEmptyLines = require('./createEmptyLines');
const countEmptyLines = require('./countEmptyLines');
const cleanEmptyLines = require('./cleanEmptyLines');

module.exports = function emptyLineBeforeGroup(item, index, declarations) {
	const prevItem = declarations[index - 1];

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
