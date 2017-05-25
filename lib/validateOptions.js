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
		!_.isUndefined(options['clean-empty-lines'])
		&& !_.isNull(options['clean-empty-lines'])
		&& !validateCleanEmptyLines(options['clean-empty-lines'])
	) {
		return reportInvalidOption('clean-empty-lines');
	}

	if (
		!_.isUndefined(options['unspecified-properties-position'])
		&& !_.isNull(options['unspecified-properties-position'])
		&& !validateUnspecifiedPropertiesPosition(options['unspecified-properties-position'])
	) {
		return reportInvalidOption('unspecified-properties-position');
	}

	if (
		!_.isUndefined(options['custom-property-empty-line-before'])
		&& !_.isNull(options['custom-property-empty-line-before'])
		&& !validateCustomPropertyEmptyLineBefore(options['custom-property-empty-line-before'])
	) {
		return reportInvalidOption('custom-property-empty-line-before');
	}

	if (
		!_.isUndefined(options['dollar-variable-empty-line-before'])
		&& !_.isNull(options['dollar-variable-empty-line-before'])
		&& !validateDollarVariableEmptyLineBefore(options['dollar-variable-empty-line-before'])
	) {
		return reportInvalidOption('dollar-variable-empty-line-before');
	}

	if (
		!_.isUndefined(options['declaration-empty-line-before'])
		&& !_.isNull(options['declaration-empty-line-before'])
		&& !validateDeclarationEmptyLineBefore(options['declaration-empty-line-before'])
	) {
		return reportInvalidOption('declaration-empty-line-before');
	}

	if (
		!_.isUndefined(options['rule-nested-empty-line-before'])
		&& !_.isNull(options['rule-nested-empty-line-before'])
		&& !validateRuleNestedEmptyLineBefore(options['rule-nested-empty-line-before'])
	) {
		return reportInvalidOption('rule-nested-empty-line-before');
	}

	if (
		!_.isUndefined(options['at-rule-nested-empty-line-before'])
		&& !_.isNull(options['at-rule-nested-empty-line-before'])
		&& !validateAtRuleNestedEmptyLineBefore(options['at-rule-nested-empty-line-before'])
	) {
		return reportInvalidOption('at-rule-nested-empty-line-before');
	}

	if (
		!_.isUndefined(options['comment-empty-line-before'])
		&& !_.isNull(options['comment-empty-line-before'])
		&& !validateCommentEmptyLineBefore(options['comment-empty-line-before'])
	) {
		return reportInvalidOption('comment-empty-line-before');
	}

	return true;
};

function reportError(errorMessage) {
	return `postcss-sorting: ${errorMessage}`;
}

function reportInvalidOption(optionName) {
	return reportError(`Invalid "${optionName}" option value`);
}

function validateSecondaryOptions(opts) {
	if (!_.isUndefined(opts.options[1])) {
		if (!_.isPlainObject(opts.options[1])) {
			return false;
		}

		if (!validateSingleSecondaryOption({
			opts: opts.options[1],
			name: 'except',
			possible: opts.exceptPossible,
		})) {
			return false;
		}

		if (!validateSingleSecondaryOption({
			opts: opts.options[1],
			name: 'ignore',
			possible: opts.ignorePossible,
		})) {
			return false;
		}
	}

	return true;
}

function validateSingleSecondaryOption(option) {
	if (!_.isUndefined(option.opts[option.name])) {
		if (!_.isArray(option.opts[option.name])) {
			return false;
		}

		if (!option.opts[option.name].every((item) => _.includes(option.possible, item))) {
			return false;
		}
	}

	return true;
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

	// Every item in the array must be a string or an object
	// with a "properties" property
	let shouldBeStringsOrObjects = false;

	if (options.every((item) => _.isString(item))) {
		shouldBeStringsOrObjects = true;
	} else if (options.every((item) => _.isPlainObject(item) && !_.isUndefined(item.properties))) {
		shouldBeStringsOrObjects = true;
	}

	if (!shouldBeStringsOrObjects) {
		return false;
	}

	const objectItems = options.filter(_.isPlainObject);

	if (!objectItems.every((item) => {
		if (!_.isUndefined(item.emptyLineBefore) && !_.isBoolean(item.emptyLineBefore)) {
			return false;
		}

		return true;
	})) {
		return false;
	}

	return true;
}

function validateCleanEmptyLines(options) {
	return _.isBoolean(options);
}

function validateUnspecifiedPropertiesPosition(options) {
	return _.isString(options)
		&& _.includes(['top', 'bottom', 'bottomAlphabetical'], options);
}

function validateCustomPropertyEmptyLineBefore(options) {
	if (_.isBoolean(options)) {
		return true;
	}

	if (!_.isArray(options)) {
		return false;
	}

	if (!_.isBoolean(options[0])) {
		return false;
	}

	if (!validateSecondaryOptions({
		options,
		exceptPossible: ['after-comment', 'after-custom-property', 'first-nested'],
		ignorePossible: ['after-comment', 'inside-single-line-block'],
	})) {
		return false;
	}

	return true;
}

function validateDollarVariableEmptyLineBefore(options) {
	if (_.isBoolean(options)) {
		return true;
	}

	if (!_.isArray(options)) {
		return false;
	}

	if (!_.isBoolean(options[0])) {
		return false;
	}

	if (!validateSecondaryOptions({
		options,
		exceptPossible: ['after-comment', 'after-dollar-variable', 'first-nested'],
		ignorePossible: ['after-comment', 'inside-single-line-block'],
	})) {
		return false;
	}

	return true;
}

function validateDeclarationEmptyLineBefore(options) {
	if (_.isBoolean(options)) {
		return true;
	}

	if (!_.isArray(options)) {
		return false;
	}

	if (!_.isBoolean(options[0])) {
		return false;
	}

	if (!validateSecondaryOptions({
		options,
		exceptPossible: ['after-comment', 'after-declaration', 'first-nested'],
		ignorePossible: ['after-comment', 'after-declaration', 'inside-single-line-block'],
	})) {
		return false;
	}

	return true;
}

function validateRuleNestedEmptyLineBefore(options) {
	if (_.isBoolean(options)) {
		return true;
	}

	if (_.isString(options)) {
		return _.includes(['always-multi-line', 'never-multi-line'], options);
	}

	if (!_.isArray(options)) {
		return false;
	}

	if (!_.includes([true, false, 'always-multi-line', 'never-multi-line'], options[0])) {
		return false;
	}

	if (!validateSecondaryOptions({
		options,
		exceptPossible: ['first-nested', 'after-rule'],
		ignorePossible: ['after-comment'],
	})) {
		return false;
	}

	return true;
}

function validateAtRuleNestedEmptyLineBefore(options) {
	if (_.isBoolean(options)) {
		return true;
	}

	if (!_.isArray(options)) {
		return false;
	}

	if (!_.isBoolean(options[0])) {
		return false;
	}

	if (!validateSecondaryOptions({
		options,
		exceptPossible: ['blockless-after-same-name-blockless', 'blockless-after-blockless', 'first-nested', 'after-same-name'],
		ignorePossible: ['blockless-after-same-name-blockless', 'blockless-after-blockless', 'after-comment'],
	})) {
		return false;
	}

	if (!_.isUndefined(options[1])) {
		if (!_.isUndefined(options[1].ignoreAtRules)) {
			if (!_.isArray(options[1].ignoreAtRules)) {
				return false;
			}

			if (!options[1].ignoreAtRules.every((item) => _.isString(item))) {
				return false;
			}
		}
	}

	return true;
}

function validateCommentEmptyLineBefore(options) {
	if (_.isBoolean(options)) {
		return true;
	}

	if (!_.isArray(options)) {
		return false;
	}

	if (!_.isBoolean(options[0])) {
		return false;
	}

	if (!validateSecondaryOptions({
		options,
		exceptPossible: ['first-nested'],
		ignorePossible: ['after-comment', 'stylelint-command'],
	})) {
		return false;
	}

	return true;
}
