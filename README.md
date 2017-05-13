# PostCSS Sorting [![Build Status][ci-img]][ci] [![npm version][npm-version-img]][npm] [![npm downloads last month][npm-downloads-img]][npm] [![Dependency status][dependencies-img]][dependencies-status]

[PostCSS] plugin to keep rules and at-rules content in order.

Also available as [Sublime Text plugin], [Atom plugin], and [VS Code plugin].

Lint style sheets order with [stylelint-order].

## Features

* Sorts rules and at-rules content.
* Sorts properties.
* Sorts at-rules by different options.
* Groups properties, custom properties, dollar variables, nested rules, nested at-rules.
* Adds empty lines before different types of nodes.
* Supports CSS, SCSS (if [postcss-scss] parser is used), [PreCSS] and most likely any other syntax added by other PostCSS plugins.

## Installation

```bash
$ npm install postcss-sorting
```

## Options

The plugin has no default options. Everything is disabled by default.

### Order

- [`order`](./docs/order.md): Specify the order of content within declaration blocks.
- [`properties-order`](./docs/properties-order.md): Specify the order of properties within declaration blocks. Can specify empty line before property groups.
- [`unspecified-properties-position`](./docs/unspecified-properties-position.md): Specify position for properties not specified in `properties-order`.

### Empty lines

- [`clean-empty-lines`](./docs/clean-empty-lines.md): Remove all empty lines. Runs before all other rules.
- [`rule-nested-empty-line-before`](./docs/rule-nested-empty-line-before.md): Specify an empty line before nested rules.
- [`at-rule-nested-empty-line-before`](./docs/at-rule-nested-empty-line-before.md): Specify an empty line before nested at-rules.
- [`declaration-empty-line-before`](./docs/declaration-empty-line-before.md): Specify an empty line before declarations.
- [`custom-property-empty-line-before`](./docs/custom-property-empty-line-before.md): Specify an empty line before custom properties.
- [`dollar-variable-empty-line-before`](./docs/dollar-variable-empty-line-before.md): Specify an empty line before `$`-variable declarations.
- [`comment-empty-line-before`](./docs/comment-empty-line-before.md): Specify an empty line before comments.

## Handling comments

Shared-line comments are comments which are located after a node and on the same line as a node.

```css
a {
	/* regular comment */
	color: pink; /* shared-line comment */
}
```

Shared-line comments are always ignored in all “empty lines before” options. The plugin always looks “through” these comments. For example:

```js
{
	"declaration-empty-line-before": [true, {
		except: "after-declaration"
	}]
}
```

Technically there is a comment before `bottom`. But it's a shared line comment, so plugin looks before this comment and sees `top`:

```css
a {
	--prop: pink;

	top: 5px; /* shared-line comment */
	bottom: 15px;
}
```

For “order” options comments that are before node and on a separate line linked to that node. Shared-line comments are also linked to that node.

```css
a {
	top: 5px; /* shared-line comment belongs to `top` */
	/* comment belongs to `bottom` */
	/* comment belongs to `bottom` */
	bottom: 15px; /* shared-line comment belongs to `bottom` */
}
```

## Migration from `1.x`

If you have been using [predefined configs], you can look at [migrated predefined configs].

`sort-order` was split into [`order`](./docs/order.md) and [`properties-order`](./docs/properties-order.md).

`properties-order` now uses an array of objects for grouping.

`sort-order` keywords to new config conversion:

| `1.x` | `2.x` |
| --- | --- |
| `@atrule` | `{ order: ["at-rules"] }`  or `{ order: [{ type: "at-rule" }] }` |
| `@atrulename` | `{ order: [{ type: "at-rule", name: "atrulename" }] }` |
| `@atrulename parameter` | `{ order: [{ type: "at-rule", name: "atrulename", parameter: "parameter" }] }` |
| `>child` | `{ order: ["rules"] }` |
| `$variable` | `{ order: ["custom-properties", "dollar-variables"] }` |
| “leftovers” token `...` | `{ "unspecified-properties-position": "bottom" }` |

Config for `1.x`:

```js
{
	"sort-order": [
		[
			"$variable"
		],
		[
			"margin",
			"padding"
		],
		[
			"border",
			"background"
		],
		[
			'...',
			"at-rule",
			"@include",
			"@include media",
			">child"
		]
	]
}
```

Config for `2.x`:

```js
{
	"order": [
		"custom-properties",
		"dollar-variables",
		"declarations",
		"at-rules",
		{
			"type": "at-rule",
			"name": "include"
		},
		{
			"type": "at-rule",
			"name": "include",
			"parameter": "icon"
		},
		"rules"
	],
	"properties-order": [
		{
			"emptyLineBefore": true,
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
	],
	"unspecified-properties-position": "bottom"
}
```

## Usage

See [PostCSS] docs for examples for your environment.

### Text editor

This plugin available as [Sublime Text plugin], [Atom plugin], and [VS Code plugin].

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

## Thanks

This plugin is heavily inspired by [stylelint]. Some code logic, tests, and documentation parts are taken from this tool.

[ci-img]: https://travis-ci.org/hudochenkov/postcss-sorting.svg
[ci]: https://travis-ci.org/hudochenkov/postcss-sorting
[npm-version-img]: https://img.shields.io/npm/v/postcss-sorting.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/postcss-sorting.svg
[dependencies-img]: https://img.shields.io/gemnasium/hudochenkov/postcss-sorting.svg
[dependencies-status]: https://gemnasium.com/github.com/hudochenkov/postcss-sorting
[npm]: https://www.npmjs.com/package/postcss-sorting

[PostCSS]: https://github.com/postcss/postcss
[Sublime Text plugin]: https://github.com/hudochenkov/sublime-postcss-sorting
[Atom plugin]: https://github.com/lysyi3m/atom-postcss-sorting
[VS Code plugin]: https://github.com/mrmlnc/vscode-postcss-sorting
[predefined configs]: https://github.com/hudochenkov/postcss-sorting/tree/ee71c3b61eea8fa11bc3aa2d26dd99a832df6d54/configs
[migrated predefined configs]: https://gist.github.com/hudochenkov/b7127590d3013a5982ed90ad63a85306

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PreCSS]: https://github.com/jonathantneal/precss
[postcss-scss]: https://github.com/postcss/postcss-scss
[perfectionist]: https://github.com/ben-eb/perfectionist
[stylefmt]: https://github.com/morishitter/stylefmt
[stylelint]: http://stylelint.io/
[stylelint-order]: https://github.com/hudochenkov/stylelint-order
