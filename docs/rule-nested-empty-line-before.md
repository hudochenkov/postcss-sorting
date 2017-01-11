# rule-nested-empty-line-before

Specify an empty line before nested rules.

## Primary option

`boolean|string`: `true|false|"always-multi-line"|"never-multi-line"`

### `true`

There *must always* be an empty line before rules.

Before:

```css
@media {
	a {}
}
```

After:

```css
@media {

	a {}
}
```

### `false`

There *must never* be an empty line before rules.

Before:

```css
@media {

	a {}
}
```

After:

```css
@media {
	a {}
}
```

### `"always-multi-line"`

There *must always* be an empty line before multi-line rules.

Before:

```css
@media {
	a {
		color: pink;
		top: 0;
	}
}
```

After:

```css
@media {

	a {
		color: pink;
		top: 0;
	}
}
```

### `"never-multi-line"`

There *must never* be an empty line before multi-line rules.

Before:

```css
@media {

	a {
		color: pink;
		top: 0;
	}
}
```

After:

```css
@media {
	a {
		color: pink;
		top: 0;
	}
}
```

## Optional secondary options

```js
[
	"<primary option>",
	{
		except: ["first-nested", "after-rule"],
		ignore: ["after-comment"]
	}
]
```

### `except: ["first-nested", "after-rule"]`

#### `"first-nested"`

Reverse the primary option if the rule is the first in a block.

Given:

```js
[true, { except: ["first-nested"] }]
```

Before:

```css
@media {

	a {}

	b {}

	c {}
}
```

After:

```css
@media {
	a {}

	b {}

	c {}
}
```

#### `"after-rule"`

Reverse the primary option if the rule comes after another rule.

Given:

```js
[true, { except: ["after-rule"] }]
```

Before:

```css
@media {
	color: red;
	a {}
	b {}
	c {}
}
```

After:

```css
@media {
	color: red;

	a {}
	b {}
	c {}
}
```

### `ignore: ["after-comment"]`

Ignore rules that come after a comment.

Given:

```js
[true, { ignore: ["after-comment"] }]
```

Before:

```css
@media {
	/* comment */
	a {}
}

@media {
	/* comment */

	a {}
}
```

After (nothing changed):

```css
@media {
	/* comment */
	a {}
}

@media {
	/* comment */

	a {}
}
```
