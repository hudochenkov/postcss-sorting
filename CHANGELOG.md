# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 1.7.0
* Added `smacss` and `alphabetical` predefined configs.
* Under the hood refactoring.

## 1.6.1
* Fixed a regression in 1.6.0. Sort order with item like `@include media` didn't found rules like `@include media(">=desk") {}`.

## 1.6.0
* Add special comments to disable processing for some part in style sheet
* Support custom properties as $variable #27
* Fix an issue when there is a lot of comments in the end of a rule #24
* At-rule parameter now supports parentheses. For example, `@include mwp(1)`. (thanks, @Redknife) #29

## 1.5.0
* Add `empty-lines-before-comment` and `empty-lines-after-comment`, which add empty lines before and after a comment or a group of comments.

## 1.4.1
* Fix issue with a rule content starting with a comment and follow by a rule. Error happens if config has any option except `sort-order`. #21

## 1.4.0
* Added `preserve-empty-lines-between-children-rules`, which preserve empty lines between children rules and preserve empty lines for comments between children rules. #20

## 1.3.1
* Fix adding additional empty line if both `empty-lines-between-children-rules` and `empty-lines-between-media-rules` are not 0. #19

## 1.3.0
* Added `empty-lines-between-media-rules` option which set a number of empty lines between nested media rules. #16

## 1.2.3
* Fixed removing last comments in the rule.
* Fixed adding empty lines between children rules if there are comments between them.

## 1.2.2
* Fixed removing comments in rule if they are only children.
* Fixed removing of the first comment in the rule if it's not on separate line.

## 1.2.1
* Fixed comments wrong ordering and added better tests for it.

## 1.2.0
* Added `empty-lines-between-children-rules` option which set a number of empty lines between nested children rules. (thanks, @scalder27) #9

## 1.1.0
* [Sort prefixed properties](https://github.com/hudochenkov/postcss-sorting#prefixed-properties) without explicit specifying in config.
* Support for SCSS files if [postcss-scss](https://github.com/postcss/postcss-scss) used for parsing.

## 1.0.1
* Change .npmignore to not deliver unneeded files.

## 1.0.0
* Initial release.
