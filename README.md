# PostCSS Sorting [![Build Status][ci-img]][ci]

[PostCSS] plugin to sort rules content with specified order. Heavily inspired by [CSSComb].

Also available as [Sublime Text plugin], [Atom plugin], and [VS Code plugin].

## Features

* Plugin is sorting content for rules and at-rules.
* Sorting nested rules.
* Sorting at-rules, also by at-rule name and parameter.
* Sorting variables.
* Grouping content.
* Support CSS, SCSS (if [postcss-scss] parser is used), [PreCSS] and most likely any other syntax added by other PostCSS plugins.

## Table of Contents

* [Installation](#installation)
* [Options](#options)
	* [Default options](#default-options)
	* [`sort-order`](#sort-order)
		* [Declarations](#declarations)
			* [Prefixed properties](#prefixed-properties)
		* [Grouping](#grouping)
		* [@at-rules](#at-rules)
		* [Nested rules](#nested-rules)
		* [Variables](#variables)
		* [Leftovers](#leftovers)
		* [Predefined configs](#predefined-configs)
	* [`empty-lines-between-children-rules`](#empty-lines-between-children-rules)
	* [`empty-lines-between-media-rules`](#empty-lines-between-media-rules)
	* [`preserve-empty-lines-between-children-rules`](#preserve-empty-lines-between-children-rules)
	* [`empty-lines-before-comment`](#empty-lines-before-comment)
	* [`empty-lines-after-comment`](#empty-lines-after-comment)
	* [Disabling in style sheet](#disabling-in-style-sheet)
	* [Migration from CSSComb](#migration-from-csscomb)
* [Usage](#usage)
	* [Text editor](#text-editor)
	* [Gulp](#gulp)
	* [Grunt](#grunt)
* [Related tools](#related-tools)

## Installation

```bash
$ npm install postcss-sorting
```

## Options

### Default options

```json
{
	"sort-order": "default",
	"empty-lines-between-children-rules": 0,
	"empty-lines-between-media-rules": 0,
	"preserve-empty-lines-between-children-rules": false
}
```

### `sort-order`

Set sort order. If no order is set, the plugin uses default config.

**Note**: Use one of [predefined configs] as an example.

Acceptable values:

* `{Array}` of rules;
* `{Array}` of arrays of rules for groups separation;
* `{String}` with the name of predefined config.

#### Declarations

Example: `{ "sort-order": [ "margin", "padding" ] }`

```css
/* before */
p {
	padding: 0;
	margin: 0;
}

/* after */
p {
	margin: 0;
	padding: 0;
}
```

##### Prefixed properties

Prefixed properties may not be in sort order. Plugin will look for unprefixed property and if it find one it will use that property order for the prefixed property. It would be better not to write prefixed properties in CSS at all and delegate this job to [Autoprefixer].

Example: `{ "sort-order": [ "position", "-webkit-box-sizing", "box-sizing", "width" ] }`

```css
/* before */
div {
	-moz-box-sizing: border-box;
	width: 100%;
	box-sizing: border-box;
	position: absolute;
	-webkit-box-sizing: border-box;
}

/* after */
div {
	position: absolute;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	width: 100%;
}
```

#### Grouping

Using an array of arrays for `sort-order` separate content into groups by an empty line.

Example: `{ "sort-order": [ [ "margin", "padding" ], [ "border", "background" ] ] }`

```css
/* before */
p {
	background: none;
	border: 0;
	margin: 0;
	padding: 0;
}

/* after */
p {
	margin: 0;
	padding: 0;

	border: 0;
	background: none;
}
```

#### @at-rules

Any @at-rule inside another rule can be sorted. There is some keywords:

* `@atrule` — any at-rule.
* `@atrulename` — any at-rule with a specific name. Ex., `@media` or `@mixin`.
* `@atrulename parameter` — any at-rule with specific name and parameter. Ex., `@mixin clearfix`.

Example: `{ "sort-order": ["@atrule", "@mixin", "border", "@some-rule hello", "@mixin clearfix"] }`

```scss
/* before */
.block {
	@some-rule hello;
	border: none;
	@mixin clearfix;
	@media (min-width: 100px) {
		display: none;
	}
	@mixin island;
}

/* after */
.block {
	@media (min-width: 100px) {
		display: none;
	}
	@mixin island;
	border: none;
	@some-rule hello;
	@mixin clearfix;
}
```

#### Nested rules

`>child` keyword for nested rules.

Example: `{ "sort-order": [ ["position", "top", "width"], ['>child'] ] }`

```scss
/* before */
.block {
	position: absolute;

	span {
		display: inline-block;
	}

	width: 50%;

	&__element {
		display: none;
	}

	top: 0;
}

/* after */
.block {
	position: absolute;
	top: 0;
	width: 50%;

	span {
		display: inline-block;
	}
	&__element {
		display: none;
	}
}
```

#### Variables

`$variable` keyword is using to sort variables like `$size`.

Example: `{ "sort-order": [ ["$variable"], ["position", "top", "width", "height"] ] }`

```scss
/* before */
.block {
	position: absolute;
	$width: 10px;
	top: 0;
	$height: 20px;
	height: $height;
	width: $width;
}

/* after */
.block {
	$width: 10px;
	$height: 20px;

	position: absolute;
	top: 0;
	width: $width;
	height: $height;
}
```

#### Leftovers

When there are properties that are not mentioned in the `sort-order` option, they are inserted after all the sorted properties in the new group in the same order they were in the source stylesheet.

You can override this by using a “leftovers” token: `...` — just place it either in its own group or near other properties in any other group and CSSComb would place all the properties that were not sorted where the `...` was in `sort-order`.

So, with this value:

``` json
{
	"sort-order": [
		["$variable"],
		["position"],
		["...", "border"],
		["@mixin"],
		["font"]
	]
}
```

everything would go into five groups: variables, then group with `position`, then group containing all the leftovers plus the `border`, then group with all mixins and then the `font`.

#### Predefined configs

[PostCSS Sorting] have [predefined configs]:

* `default`
* `alphabetical`
* `zen`
* `csscomb`
* `yandex`
* `smacss`

Example: `{ "sort-order": "zen" }`

### `empty-lines-between-children-rules`

Set a number of empty lines between nested children rules. By default there is no empty lines between `>child` rules.

Acceptable value: `{Number}` of empty lines

Example: `{ "empty-lines-between-children-rules": 1, "sort-order": [ ["..."], [">child"] ] }`

```scss
/* before */
.block {
	position: absolute;

	span {
		display: inline-block;
	}


	&__element {
		display: none;
	}
	&:hover {
		top: 0;
	}
}

/* after */
.block {
	position: absolute;

	span {
		display: inline-block;
	}

	&__element {
		display: none;
	}

	&:hover {
		top: 0;
	}
}
```

### `empty-lines-between-media-rules`

Set a number of empty lines between nested media rules. By default there is no empty lines between `@media` rules.

Acceptable value: `{Number}` of empty lines

Example: `{ "empty-lines-between-media-rules": 1, "sort-order": ["@media"] }`

```scss
/* before */
.block {
	@media (min-width: 1px) {}


	@media (min-width: 2px) {}
	@media (min-width: 3px) {}
}

/* after */
.block {
	@media (min-width: 1px) {}

	@media (min-width: 2px) {}

	@media (min-width: 3px) {}
}
```

### `preserve-empty-lines-between-children-rules`

Preserve empty lines between children rules and preserve empty lines for comments between children rules.

Acceptable value: `true`

Example: `{ "preserve-empty-lines-between-children-rules": true }`

```scss
/* before */
.block {
	&:before {}
	&:after {}

	.element {}

	/* comment */

	.child {}
}

/* after (nothing changed) */
.block {
	&:before {}
	&:after {}

	.element {}

	/* comment */

	.child {}
}
```

### `empty-lines-before-comment`

Set a number of empty lines before comment or comments group, which on separate lines. By default, there are no empty lines before comment.

Acceptable value: `{Number}` of empty lines

Example: `{ "empty-lines-before-comment": 2, "sort-order": [ "..." ] }`

```scss
/* before */
.hello {
	display: inline-block;
	/* upline comment 1 */
	/* upline comment 2 */
	font-style: italic;
	border-bottom: 1px solid red; /* trololo 1 */ /* trololo 2 */
	/* arrow */
	&:before {
		/* yeah */
		content: "";
	}
	/* thing */
	&:after {
		/* joy */
		display: none;
	}
	&__element {
		/* sdfsf */
	}
}

/* after */
.hello {
	display: inline-block;


	/* upline comment 1 */
	/* upline comment 2 */
	font-style: italic;
	border-bottom: 1px solid red; /* trololo 1 */ /* trololo 2 */


	/* arrow */
	&:before {
		/* yeah */
		content: "";
	}


	/* thing */
	&:after {
		/* joy */
		display: none;
	}
	&__element {
		/* sdfsf */
	}
}
```

### `empty-lines-after-comment`

Set a number of empty lines after comment or comments group, which on separate lines. By default, there are no empty lines after comment.

Acceptable value: `{Number}` of empty lines

Example: `{ "empty-lines-after-comment": 2, "sort-order": [ "..." ] }`

```scss
/* before */
.hello {
	display: inline-block;
	/* upline comment 1 */
	/* upline comment 2 */
	font-style: italic;
	border-bottom: 1px solid red; /* trololo 1 */ /* trololo 2 */
	/* arrow */
	&:before {
		/* yeah */
		content: "";
	}
	/* thing */
	&:after {
		/* joy */
		display: none;
	}
	&__element {
		/* sdfsf */
	}
}

/* after */
.hello {
	display: inline-block;
	/* upline comment 1 */
	/* upline comment 2 */


	font-style: italic;
	border-bottom: 1px solid red; /* trololo 1 */ /* trololo 2 */
	/* arrow */


	&:before {
		/* yeah */


		content: "";
	}
	/* thing */


	&:after {
		/* joy */


		display: none;
	}
	&__element {
		/* sdfsf */
	}
}
```

### Disabling in style sheet

The plugin can be temporarily turned off by using special comments.

```css
/* postcss-sorting: off */
.block1 {
	width: 50px;
	display: inline-block;
}
/* postcss-sorting: on */
```

Due to plugin nature only comments in the root of stylesheet will affect plugin processing. In this case comments will be treated like regular comments:

```css
.block5 {
	/* postcss-sorting: off */
	width: 20px;
	display: inline-block;
	/* postcss-sorting: on */
}
```

### Migration from CSSComb

If you used to use custom sorting order in [CSSComb] you can easily use this sorting order in PostCSS Sorting. `sort-order` option in this plugin is compatible with `sort-order` in CSSComb. Just copy `sort-order` value from CSSComb config to PostCSS Sorting config.

## Usage

See [PostCSS] docs for examples for your environment.

#### Text editor

This plugin available as [Sublime Text plugin], [Atom plugin], and [VS Code plugin].

#### Gulp

Add [Gulp PostCSS] and PostCSS Sorting to your build tool:

```bash
npm install gulp-postcss postcss-sorting --save-dev
```

Enable PostCSS Sorting within your Gulpfile:

```js
var postcss = require('gulp-postcss');
var sorting = require('postcss-sorting');

gulp.task('css', function () {
	return gulp.src('./css/src/*.css').pipe(
		postcss([
			sorting({ /* options */ })
		])
	).pipe(
		gulp.dest('./css')
	);
});
```

#### Grunt

Add [Grunt PostCSS] and PostCSS Sorting to your build tool:

```bash
npm install grunt-postcss postcss-sorting --save-dev
```

Enable PostCSS Sorting within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
				require('postcss-sorting')({ /* options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

## Related tools

If you want format stylesheets, use [perfectionist] or [stylefmt], also a PostCSS-based tool.

Don't forget to lint stylesheets with [stylelint]!

## Thanks

This plugin is heavily inspired by [CSSComb]. Some code logic, tests, and documentation parts are taken from this tool.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]: https://travis-ci.org/hudochenkov/postcss-sorting.svg
[ci]: https://travis-ci.org/hudochenkov/postcss-sorting
[PostCSS Sorting]: https://github.com/hudochenkov/postcss-sorting
[predefined configs]: https://github.com/hudochenkov/postcss-sorting/tree/master/configs
[Sublime Text plugin]: https://github.com/hudochenkov/sublime-postcss-sorting
[Atom plugin]: https://github.com/lysyi3m/atom-postcss-sorting
[VS Code plugin]: https://github.com/mrmlnc/vscode-postcss-sorting

[CSSComb]: https://github.com/csscomb/csscomb.js
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PreCSS]: https://github.com/jonathantneal/precss
[postcss-scss]: https://github.com/postcss/postcss-scss
[Autoprefixer]: https://github.com/postcss/autoprefixer
[perfectionist]: https://github.com/ben-eb/perfectionist
[stylefmt]: https://github.com/morishitter/stylefmt
[stylelint]: http://stylelint.io/
