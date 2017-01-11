# properties-order

Specify the order of properties within declaration blocks. Can specify empty line before property groups.

Prefixed properties *will always* precede the unprefixed version.

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

`string|array`: `"alphabetical"|["array", "of", "unprefixed", "property", "names"]|["array", "of", "group", "objects"]`

## `"alphabetical"`

Properties will be ordered alphabetically.

Before:

```css
a {
	top: 0;
	color: pink;
}

a {
	-moz-transform: scale(1);
	transform: scale(1);
	-webkit-transform: scale(1);
}
```

After:

```css
a {
	color: pink;
	top: 0;
}

a {
	-moz-transform: scale(1);
	-webkit-transform: scale(1);
	transform: scale(1);
}
```

## `["array", "of", "unprefixed", "property", "names"]|["array", "of", "group", "objects"]`

Within an order array, you can include:

- unprefixed property names
- group objects with these properties:
    - `properties (array of strings)`: The properties in this group.
    - `emptyLineBefore (true|false)`: By default it's disabled and doesn't affect anything. If `true`, this group will be separated from other properties by an empty newline. If `false`, the group will have no empty lines separating it from other properties.

**By default, unlisted properties will be placed after all listed properties.** So if you specify an array and do not include `display`, that means that the `display` property can be included before or after all specified properties. *This can be changed with the [`unspecified-properties-position`](./unspecified-properties-position.md) option*.

Given:

```js
["transform", "top", "color"]
```

Before:

```css
a {
	color: pink;
	top: 0;
}

a {
	-moz-transform: scale(1);
	color: pink;
	transform: scale(1);
	-webkit-transform: scale(1);
}
```

After:

```css
a {
	top: 0;
	color: pink;
}

a {
	-moz-transform: scale(1);
	-webkit-transform: scale(1);
	transform: scale(1);
	color: pink;
}
```

---

Given:

```js
[
	{
		properties: [
			"position",
			"top"
		]
	},
	{
		properties: [
			"display",
			"z-index"
		]
	}
]
```

Before:

```css
a {
	z-index: 2;
	top: 0;

	position: absolute;
	display: block;
}
```

After:

```css
a {

	position: absolute;
	top: 0;
	display: block;
	z-index: 2;
}
```

Note: Empty line before `position` is preserved.

---

Given:

```js
[
	{
		emptyLineBefore: true,
		properties: [
			"position",
			"top"
		]
	},
	{
		emptyLineBefore: true,
		properties: [
			"display",
			"z-index"
		]
	}
]
```

Before:

```css
a {
	position: absolute;
	top: 0;
	display: block;
	z-index: 2;
}
```

After:

```css
a {
	position: absolute;
	top: 0;

	display: block;
	z-index: 2;
}
```

---

Given:

```js
[
	{
		emptyLineBefore: false,
		properties: [
			"position",
			"top"
		]
	},
	{
		emptyLineBefore: false,
		properties: [
			"display",
			"z-index"
		]
	}
]
```

Before:

```css
a {
	position: absolute;
	top: 0;

	display: block;
	z-index: 2;
}
```

After:

```css
a {
	position: absolute;
	top: 0;
	display: block;
	z-index: 2;
}
```
