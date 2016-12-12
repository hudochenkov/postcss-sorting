'use strict';

const _ = require('lodash');

module.exports = function validateOptions(options) {
	if (!_.isPlainObject(options)) {
		throw new Error('Options should be an object.');
	}

	if (!_.isUndefined(options.order) && !validateOrder(options.order)) {
		return false;
	}

	if (!_.isUndefined(options['properties-order'])) {
		// placeholder
	}

	return true;
};

function validateOrder(options) {
	// Otherwise, begin checking array options
	if (!Array.isArray(options)) {
		return false;
	}

	// Every item in the array must be a certain string or an object
	// with a "type" property
	if (!options.every((item) => {
		if (_.isString(item)) {
			return _.includes(['custom-properties', 'dollar-variables', 'declarations', 'rules', 'at-rules'], item);
		}

		return _.isPlainObject(item) && !_.isUndefined(item.type);
	})) {
		return false;
	}

	const objectItems = options.filter(_.isPlainObject);

	if (!objectItems.every((item) => {
		let result = true;

		if (item.type !== 'at-rule') {
			return false;
		}

		// if parameter is specified, name should be specified also
		if (!_.isUndefined(item.parameter) && _.isUndefined(item.name)) {
			return false;
		}

		if (!_.isUndefined(item.hasBlock)) {
			result = item.hasBlock === true || item.hasBlock === false;
		}

		if (!_.isUndefined(item.name)) {
			result = _.isString(item.name) && item.name.length;
		}

		if (!_.isUndefined(item.parameter)) {
			result = (_.isString(item.parameter) && item.parameter.length) || _.isRegExp(item.parameter);
		}

		return result;
	})) {
		return false;
	}

	return true;
}
