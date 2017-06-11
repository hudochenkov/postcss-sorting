# PostCSS Sorting [![Build Status][ci-img]][ci] [![npm version][npm-version-img]][npm] [![npm downloads last month][npm-downloads-img]][npm] [![Dependency status][dependencies-img]][dependencies-status]

[PostCSS] plugin to keep rules and at-rules content in order.

Also available as [Sublime Text], [Atom], [VS Code], and [Emacs] plugin.

Lint and autofix style sheets order with [stylelint-order].

## Features

* Sorts rules and at-rules content.
* Sorts properties.
* Sorts at-rules by different options.
* Groups properties, custom properties, dollar variables, nested rules, nested at-rules.
* Supports CSS, SCSS (if [postcss-scss] parser is used), [PreCSS] and most likely any other syntax added by other PostCSS plugins.

## Installation

```bash
$ npm install postcss-sorting
```

## Options

The plugin has no default options. Everything is disabled by default.

- [`order`](./lib/order/README.md): Specify the order of content within declaration blocks.
- [`properties-order`](./lib/properties-order/README.md): Specify the order of properties within declaration blocks.
- [`unspecified-properties-position`](./lib/properties-order/unspecified-properties-position.md): Specify position for properties not specified in `properties-order`.

## Handling comments

Comments that are before node and on a separate line linked to that node. Shared-line comments are also linked to that node. Shared-line comments are comments which are located after a node and on the same line as a node.

```css
a {
	top: 5px; /* shared-line comment belongs to `top` */
	/* comment belongs to `bottom` */
	/* comment belongs to `bottom` */
	bottom: 15px; /* shared-line comment belongs to `bottom` */
}
```

## Migration from `2.x`

Remove all `*-empty-line-before` and `clean-empty-lines` options. Use [stylelint] with `--fix` option instead.

`properties-order` doesn't support property groups. Convert it to simple array. Use [stylelint-order] with `--fix` option for empty line before property groups.

Config for `2.x`:

```json
{
	"properties-order": [
		{
			"properties": [
				"margin",
				"padding"
			]
		},
		{
			"emptyLineBefore": true,
			"properties": [
				"border",
				"background"
			]
		}
	]
}
```

Config for `3.x`:

```json
{
	"properties-order": [
		"margin",
		"padding",
		"border",
		"background"
	]
}
```

## Usage

See [PostCSS] docs for examples for your environment.

### Text editor

This plugin available as [Sublime Text], [Atom], [VS Code], and [Emacs] plugin.

### Gulp

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
		gulp.dest('./css/src')
	);
});
```

### Grunt

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

[stylelint] and [stylelint-order] help lint style sheets and let know if style sheet order is correct.

If you want format style sheets, use [perfectionist] or [stylefmt], also a PostCSS-based tools.

[ci-img]: https://travis-ci.org/hudochenkov/postcss-sorting.svg
[ci]: https://travis-ci.org/hudochenkov/postcss-sorting
[npm-version-img]: https://img.shields.io/npm/v/postcss-sorting.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/postcss-sorting.svg
[dependencies-img]: https://img.shields.io/gemnasium/hudochenkov/postcss-sorting.svg
[dependencies-status]: https://gemnasium.com/github.com/hudochenkov/postcss-sorting
[npm]: https://www.npmjs.com/package/postcss-sorting

[PostCSS]: https://github.com/postcss/postcss
[Sublime Text]: https://github.com/hudochenkov/sublime-postcss-sorting
[Atom]: https://github.com/lysyi3m/atom-postcss-sorting
[VS Code]: https://github.com/mrmlnc/vscode-postcss-sorting
[Emacs]: https://github.com/P233/postcss-sorting.el

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PreCSS]: https://github.com/jonathantneal/precss
[postcss-scss]: https://github.com/postcss/postcss-scss
[perfectionist]: https://github.com/ben-eb/perfectionist
[stylefmt]: https://github.com/morishitter/stylefmt
[stylelint]: https://stylelint.io/
[stylelint-order]: https://github.com/hudochenkov/stylelint-order
