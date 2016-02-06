# PostCSS Sorting [![Build Status][ci-img]][ci]

[PostCSS] plugin to sort rules content with specified order. Heavily inspired by [CSSComb].

Also available as [Sublime Text plugin] and unofficial [Atom plugin].

## Features

* Plugin is sorting content for rules and at-rules.
* Sorting nested rules.
* Sorting at-rules, also by at-rule name and parameter.
* Sorting variables.
* Grouping content.
* Support CSS, SCSS (if [postcss-scss] parser is used), [PreCSS] and most likely any other syntax added by other PostCSS plugins.

## Installation

```bash
$ npm install postcss-sorting
```

## Options

Currently, there are only two options.

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
* `zen`
* `csscomb`
* `yandex`

Example: `{ "sort-order": "zen" }`

### `empty-lines-between-children-rules`

Set a number of empty lines between nested children rules. By default there is no empty lines between '>child' rules.

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

## Usage

See [PostCSS] docs for examples for your environment.

#### Sublime Text

See [Sublime Text plugin] repository.

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [PostCSS Sorting] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
    return gulp.src('./css/src/*.css').pipe(
        postcss([
            require('postcss-sorting')({ /* options */ })
        ])
    ).pipe(
        gulp.dest('./css')
    );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Enable [PostCSS Sorting] within your Gruntfile:

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

## Thanks

This plugin is heavily inspired by [CSSComb]. Some code logic, tests, and documentation parts are taken from this tool.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]: https://travis-ci.org/hudochenkov/postcss-sorting.svg
[ci]: https://travis-ci.org/hudochenkov/postcss-sorting
[PostCSS Sorting]: https://github.com/hudochenkov/postcss-sorting
[predefined configs]: https://github.com/hudochenkov/postcss-sorting/tree/master/configs
[Sublime Text plugin]: https://github.com/hudochenkov/sublime-postcss-sorting
[Atom plugin]: https://github.com/lysyi3m/atom-postcss-sorting

[CSSComb]: https://github.com/csscomb/csscomb.js
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PreCSS]: https://github.com/jonathantneal/precss
[postcss-scss]: https://github.com/postcss/postcss-scss
[Autoprefixer]: https://github.com/postcss/autoprefixer
