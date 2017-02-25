'use strict';

const postcss = require('postcss');
const _ = require('lodash');

const cleanEmptyLines = require('../cleanEmptyLines');
const createEmptyLines = require('../createEmptyLines');
const getPreviousNonSharedLineCommentNode = require('../getPreviousNonSharedLineCommentNode');
const hasEmptyLine = require('../hasEmptyLine');
const checkOption = require('../checkOption');
const isRuleWithNodes = require('../isRuleWithNodes');

module.exports = function (css, opts) {
};
