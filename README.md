# PostCSS Sorting [![Build Status][ci-img]][ci]

[PostCSS] plugin to sort rules and at-rules content with specified order.

Also available as [Sublime Text plugin], [Atom plugin], and [VS Code plugin].

[stylelint-order] is order linter.

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

Plugin has no default options. Everything is disabled by default.

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
		gulp.dest('./css/src')
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

[stylelint] and [stylelint-order] help lint style sheets and let know if style sheet order is correct.

If you want format style sheets, use [perfectionist] or [stylefmt], also a PostCSS-based tools.

## Thanks

This plugin is heavily inspired by [stylelint]. Some code logic, tests, and documentation parts are taken from this tool.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]: https://travis-ci.org/hudochenkov/postcss-sorting.svg
[ci]: https://travis-ci.org/hudochenkov/postcss-sorting
[Sublime Text plugin]: https://github.com/hudochenkov/sublime-postcss-sorting
[Atom plugin]: https://github.com/lysyi3m/atom-postcss-sorting
[VS Code plugin]: https://github.com/mrmlnc/vscode-postcss-sorting

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PreCSS]: https://github.com/jonathantneal/precss
[postcss-scss]: https://github.com/postcss/postcss-scss
[perfectionist]: https://github.com/ben-eb/perfectionist
[stylefmt]: https://github.com/morishitter/stylefmt
[stylelint]: http://stylelint.io/
[stylelint-order]: https://github.com/hudochenkov/stylelint-order
