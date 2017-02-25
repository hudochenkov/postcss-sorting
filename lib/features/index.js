'use strict';

module.exports = {
	'clean-empty-lines': require('./clean-empty-lines'), // Having this option before `properties-order`, because later one can add empty lines by `emptyLineBefore`
	'order': require('./order'),
	'properties-order': require('./properties-order'),
	'custom-property-empty-line-before': require('./custom-property-empty-line-before'),
	'dollar-variable-empty-line-before': require('./dollar-variable-empty-line-before'),
	'declaration-empty-line-before': require('./declaration-empty-line-before'),
	'rule-nested-empty-line-before': require('./rule-nested-empty-line-before'),
	'at-rule-nested-empty-line-before': require('./at-rule-nested-empty-line-before'),
	'comment-empty-line-before': require('./comment-empty-line-before'),
};
