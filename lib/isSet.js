'use strict';

const _ = require('lodash');

module.exports = function isSet(option) {
	return !_.isUndefined(option) && !_.isNull(option);
};
