# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
