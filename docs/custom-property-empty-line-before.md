# custom-property-empty-line-before

Specify an empty line before custom properties.

## Primary option

`boolean`: `true|false`

### `true`

Before:

```css
a {
	top: 10px;
	--foo: pink;
	--bar: red;
}
```

After:

```css
a {
	top: 10px;

	--foo: pink;

	--bar: red;
}
```

### `false`

Before:

```css
a {
	top: 10px;

	--foo: pink;

	--bar: red;
}
```

```css
a {

	--foo: pink;
	--bar: red;
}
```

After:

```css
a {
	top: 10px;
	--foo: pink;
	--bar: red;
}
```

```css
a {
	--foo: pink;
	--bar: red;
}
```

## Optional secondary options

```js
[
	"<primary option>",
	{
		except: ["after-comment", "after-custom-property", "first-nested"],
		ignore: ["after-comment", "inside-single-line-block"]
	}
]
```

### `except: ["after-comment", "after-custom-property", "first-nested"]`

#### `"after-comment"`

Reverse the primary option for custom properties that come after a comment.

Given:

```js
[true, { except: ["after-comment"] }]
```

Before:

```css
a {

	--foo: pink;
	/* comment */

	--bar: red;
}
```

After:

```css
a {

	--foo: pink;
	/* comment */
	--bar: red;
}

```

#### `"after-custom-property"`

Reverse the primary option for custom properties that come after another custom property.

Given:

```js
[true, { except: ["after-custom-property"] }]
```

Before:

```css
a {

	--foo: pink;

	--bar: red;
}
```

After:

```css
a {

	--foo: pink;
	--bar: red;
}
```

#### `"first-nested"`

Reverse the primary option for custom properties that are nested and the first child of their parent node.

Given:

```js
[true, { except: ["first-nested"] }]
```

Before:

```css
a {

	--foo: pink;

	--bar: red;
}
```

After:

```css
a {
	--foo: pink;

	--bar: red;
}
```

### `ignore: ["after-comment", "inside-single-line-block"]`

#### `"after-comment"`

Ignore custom properties that are preceded by comments.

Given:

```js
[true, { ignore: ["after-comment"] }]
```

```css
a {
	/* comment */
	--foo: pink;
}
```

#### `"inside-single-line-block"`

Ignore custom properties that are inside single-line blocks.

Given:

```js
[true, { ignore: ["inside-single-line-block"] }]
```

```css
a { --foo: pink; --bar: red; }
```
