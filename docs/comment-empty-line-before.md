# comment-empty-line-before

Specify an empty line before comments.

If you're using a custom syntax which support single-line comments with `//`, those are ignored as well.

## Options

`boolean`: `true|false`

### `true`

There *must always* be an empty line before comments.

Before:

```css
a {
	display: block;
	/* comment */
}
```

After:

```css
a {
	display: block;

	/* comment */
}
```

### `false`

There *must never* be an empty line before comments.

Before:

```css
a {
	display: block;

	/* comment */
}
```

After:

```css
a {
	display: block;
	/* comment */
}
```

## Optional secondary options

```js
[
	"<primary option>",
	{
		except: ["first-nested"],
		ignore: ["after-comment", "stylelint-command"]
	}
]
```

### `except: ["first-nested"]`

Reverse the primary option for comments that are nested and the first child of their parent node.

Given:

```js
[true, { except: ["first-nested"] }]
```

Before:

```css
a {

	/* comment */
	color: pink;
}
```

After:

```css
a {
	/* comment */
	color: pink;
}
```

### `ignore: ["after-comment", "stylelint-command"]`

#### `"after-comment"`

Don't require an empty line between comments.

Given:

```js
[true, { ignore: ["after-comment"] }]
```

```css
a {
	background: pink;

	/* comment */
	/* comment */
	color: #eee;
}
```

```css
a {
	background: pink;

	/* comment */

	/* comment */
	color: #eee;
}
```

#### `"stylelint-command"`

Ignore comments that deliver commands to [stylelint](http://stylelint.io/user-guide/configuration/#turning-rules-off-from-within-your-css), e.g. `/* stylelint-disable color-no-hex */`.

Given:

```js
[true, { ignore: ["stylelint-command"] }]
```

```css
a {
	background: pink;

	/* not a stylelint command */
	color: #eee;
}
```

```css
a {
	background: pink;
	/* stylelint-disable color-no-hex */
	color: pink;
}
```

```css
a {
	background: pink;

	/* stylelint-disable color-no-hex */
	color: pink;
}
```
