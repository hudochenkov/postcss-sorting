'use strict';

const _ = require('lodash');

module.exports = function validateOptions(options) {
	if (
		_.isUndefined(options)
		|| _.isNull(options)
	) {
		return false;
	}

	if (!_.isPlainObject(options)) {
		return reportError('Options should be an object.');
	}

	if (
		!_.isUndefined(options.order)
		&& !_.isNull(options.order)
		&& !validateOrder(options.order)
	) {
		return reportInvalidOption('order');
	}

	if (
		!_.isUndefined(options['properties-order'])
		&& !_.isNull(options['properties-order'])
		&& !validatePropertiesOrder(options['properties-order'])
	) {
		return reportInvalidOption('properties-order');
	}

	if (
		!_.isUndefined(options['unspecified-properties-position'])
		&& !_.isNull(options['unspecified-properties-position'])
		&& !validateUnspecifiedPropertiesPosition(options['unspecified-properties-position'])
	) {
		return reportInvalidOption('unspecified-properties-position');
	}

	return true;
};

function reportError(errorMessage) {
	return `postcss-sorting: ${errorMessage}`;
}

function reportInvalidOption(optionName) {
	return reportError(`Invalid "${optionName}" option value`);
}

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

		if (item.type !== 'at-rule' && item.type !== 'rule') {
			return false;
		}

		if (item.type === 'at-rule') {
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
		}

		if (item.type === 'rule') {
			if (!_.isUndefined(item.selector)) {
				result = (_.isString(item.selector) && item.selector.length) || _.isRegExp(item.selector);
			}
		}

		return result;
	})) {
		return false;
	}

	return true;
}

function validatePropertiesOrder(options) {
	// Return true early if alphabetical
	if (options === 'alphabetical') {
		return true;
	}

	// Otherwise, begin checking array options
	if (!Array.isArray(options)) {
		return false;
	}

	// Every item in the array must be a string
	if (!options.every((item) => _.isString(item))) {
		return false;
	}

	return true;
}

function validateUnspecifiedPropertiesPosition(options) {
	return _.isString(options)
		&& _.includes(['top', 'bottom', 'bottomAlphabetical'], options);
}
