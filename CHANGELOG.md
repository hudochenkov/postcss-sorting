# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
