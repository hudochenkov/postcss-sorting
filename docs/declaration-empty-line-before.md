# declaration-empty-line-before

Specify an empty line before declarations.

## Primary option

`boolean`: `true|false`

### `true`

Before:

```css
a {
	--foo: pink;
	top: 5px;
}
```

```css
a {
	bottom: 15px;
	top: 5px;
}
```

After:

```css
a {
	--foo: pink;

	top: 5px;
}
```

```css
a {

	bottom: 15px;

	top: 5px;
}
```

### `false`

Before:

```css
a {
	--foo: pink;

	bottom: 15px;
}
```

```css
a {

	bottom: 15px;

	top: 5px;
}
```

After:

```css
a {
	--foo: pink;
	bottom: 15px;
}
```

```css
a {
	bottom: 15px;
	top: 5px;
}
```

## Optional secondary options

```js
[
	"<primary option>",
	{
		except: ["after-comment", "after-declaration", "first-nested"],
		ignore: ["after-comment", "after-declaration", "inside-single-line-block"]
	}
]
```

### `except: ["after-comment", "after-declaration", "first-nested"]`

#### `"after-comment"`

Reverse the primary option for declarations that come after a comment.

Given:

```js
[true, { except: ["after-comment"] }]
```

Before:

```css
a {
	/* comment */

	top: 5px;
}
```

After:

```css
a {
	/* comment */
	top: 5px;
}

```

#### `"after-declaration"`

Reverse the primary option for declarations that come after another declaration.

Given:

```js
[true, { except: ["after-declaration"] }]
```

Before:

```css
a {

	bottom: 15px;

	top: 5px;
}
```

After:

```css
a {

	bottom: 15px;
	top: 5px;
}
```

#### `"first-nested"`

Reverse the primary option for declarations that are nested and the first child of their parent node.

Given:

```js
[true, { except: ["first-nested"] }]
```

Before:

```css
a {

	bottom: 15px;

	top: 5px;
}
```

After:

```css
a {
	bottom: 15px;

	top: 5px;
}
```

### `ignore: ["after-comment", "after-declaration", "inside-single-line-block"]`

#### `"after-comment"`

Ignore declarations that are preceded by comments.

Given:

```js
[true, { ignore: ["after-comment"] }]
```

```css
a {
	/* comment */
	bottom: 15px;
}
```

```css
a {
	/* comment */

	bottom: 15px;
}
```

#### `"after-declaration"`

Ignore declarations that are preceded by declarations, to allow for multiple declaration sets in the same block.

Given:

```js
[true, { ignore: ["after-declaration"] }]
```

```css
a {

	bottom: 15px;
	top: 15px;
}
```

```css
a {

	bottom: 15px;

	top: 15px;
}
```

```css
a {

	color: orange;
	text-decoration: none;

	bottom: 15px;
	top: 15px;
}
```

#### `"inside-single-line-block"`

Ignore declarations that are inside single-line blocks.

Given:

```js
[true, { ignore: ["inside-single-line-block"] }]
```

```css
a { bottom: 15px; top: 5px; }
```
