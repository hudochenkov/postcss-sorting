# at-rule-nested-empty-line-before

Specify an empty line before nested at-rules.

## Primary option

`boolean`: `true|false`

### `true`

There *must always* be an empty line before at-rules.

Before:

```css
div {
	a {}
	@media {}
}
```

After:

```css
div {
	a {}

	@media {}
}
```

### `false`

There *must never* be an empty line before at-rules.

Before:

```css
div {
	a {}

	@media {}
}
```

After:

```css
div {
	a {}
	@media {}
}
```

## Optional secondary options

```js
[
	"<primary option>",
	{
		except: ["after-same-name", "blockless-after-blockless", "blockless-after-same-name-blockless", "first-nested"],
		ignore: ["after-comment", "blockless-after-blockless", "blockless-after-same-name-blockless"],
		ignoreAtRules: ["array", "of", "at-rules"]
	}
]
```

### `except: ["after-same-name", "blockless-after-same-name-blockless", "blockless-after-blockless", "first-nested"]`

#### `"after-same-name"`

Reverse the primary option for at-rules that follow another at-rule with the same name.

This means that you can group your at-rules by name.

Given:

```js
[true, { except: ["after-same-name"] }]
```

Before:

```scss
a {
	@extends .foo;
	@extends .bar;
	@include x;
	@include y {}
}
```

After:

```scss
a {

	@extends .foo;
	@extends .bar;

	@include x;
	@include y {}
}
```

#### `"blockless-after-same-name-blockless"`

Reverse the primary option for blockless at-rules that follow another blockless at-rule with the same name.

This means that you can group your blockless at-rules by name.

Given:

```js
[true, { except: ["blockless-after-same-name-blockless"] }]
```

Before:

```css
a {
	@extends .foo;
	@extends .bar;
	@include loop;
	@include doo;
}
```

After:

```css
a {

	@extends .foo;
	@extends .bar;

	@include loop;
	@include doo;
}
```

#### `"blockless-after-blockless"`

Reverse the primary option for blockless at-rules that follow another blockless at-rule.

Given:

```js
[true, { except: ["blockless-after-blockless"] }]
```

Before:

```css
a {
	@import url(x.css);

	@import url(y.css);

	@media print {}
}
```

After:

```css
a {

	@import url(x.css);
	@import url(y.css);

	@media print {}
}
```

#### `"first-nested"`

Reverse the primary option for at-rules that are the first child of their parent node.

Given:

```js
[true, { except: ["blockless-after-blockless"] }]
```

Before:

```css
a {

	@extend foo;
	color: pink;
}

b {
	color: pink;
	@extend foo;
}
```

After:

```css
a {
	@extend foo;
	color: pink;
}

b {
	color: pink;

	@extend foo;
}
```

### `ignore: ["after-comment", "blockless-after-blockless", "blockless-after-same-name-blockless"]`

#### `"after-comment"`

Ignore at-rules that come after a comment.

Given:

```js
[true, { ignore: ["after-comment"] }]
```

```css
a {
	/* comment */
	@media {}
}
```

```css
a {
	/* comment */

	@media {}
}
```

#### `"blockless-after-same-name-blockless"`

Ignore blockless at-rules that follow another blockless at-rule with the same name.

This means that you can group your blockless at-rules by name.

Given:

```js
[true, { ignore: ["blockless-after-same-name-blockless"] }]
```

```css
a {

	@extends .foo;
	@extends .bar;

	@include loop;
	@include doo;
}
```

```css
a {

	@extends .foo;

	@extends .bar;

	@include loop;

	@include doo;
}
```

#### `"blockless-after-blockless"`

Ignore blockless at-rules that follow another blockless at-rule.

Given:

```js
[true, { ignore: ["blockless-after-blockless"] }]
```

```css
a {

	@import url(x.css);

	@import url(y.css);

	@media print {}
}
```

```css
a {

	@import url(x.css);
	@import url(y.css);

	@media print {}
}
```

### `ignoreAtRules: ["array", "of", "at-rules"]`

Ignore specified at-rules.

Given:

```js
[true, { ignoreAtRules: ["else"] }]
```

Before:

```css
a {
	@if (true) {
	} @else {
	}
}
```

After:

```css
a {

	@if (true) {
	} @else {
	}
}
```
