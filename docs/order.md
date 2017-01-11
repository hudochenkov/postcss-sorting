# order

Specify the order of content within declaration blocks.

`array`: `["array", "of", "keywords", "or", "expanded", "at-rule", "objects"]`

Within an order array, you can include:

- keywords:
	- `custom-properties` — Custom properties (e. g., `--property: 10px;`)
	- `dollar-variables` — Dollar variables (e. g., `$variable`)
	- `declarations` — CSS declarations (e. g., `display: block`)
	- `rules` — Nested rules (e. g., `span {}` in `a { span {} }`)
	- `at-rules` — Nested at-rules (e. g., `@media () {}` in `div { @media () {} }`)
- extended at-rule objects:

	```js
	{
		type: 'at-rule',
		name: 'include',
		parameter: 'hello',
		hasBlock: true
	}
	```

Extended at-rule objects have different parameters and variations.

Object parameters:

* `type`: always `"at-rule"`
* `name`: `string`. E. g., `name: "include"` for `@include`
* `parameter`: `string`|`regex`. A string will be translated into a RegExp — `new RegExp(yourString)` — so _be sure to escape properly_. E. g., `parameter: "icon"` for `@include icon(20px);`
* `hasBlock`: `boolean`. E. g., `hasBlock: true` for `@include icon { color: red; }` and not for `@include icon;`

Always specify `name` if `parameter` is specified.

Matches all at-rules:

```js
{
	type: 'at-rule'
}
```

Or keyword `at-rules`.

Matches all at-rules, which have nested elements:

```js
{
	type: 'at-rule',
	hasBlock: true
}
```

Matches all at-rules with specific name:

```js
{
	type: 'at-rule',
	name: 'media'
}
```

Matches all at-rules with specific name, which have nested elements:

```js
{
	type: 'at-rule',
	name: 'media',
	hasBlock: true
}
```

Matches all at-rules with specific name and parameter:

```js
{
	type: 'at-rule',
	name: 'include',
	parameter: 'icon'
}
```

Matches all at-rules with specific name and parameter, which have nested elements:

```js
{
	type: 'at-rule',
	name: 'include',
	parameter: 'icon',
	hasBlock: true
}
```

Each described above variant has more priority than its previous variant. For example, `{ type: 'at-rule', name: 'media' }` will be applied to an element if both `{ type: 'at-rule', name: 'media' }` and `{ type: 'at-rule', hasBlock: true }` can be applied to an element.

**Unlisted elements will be placed after all listed elements.** So if you specify an array and do not include `declarations`, that means that all declarations will be placed after any other element.

## Examples

Given:

```js
["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"]
```

Before:

```css
a {
	top: 0;
	--height: 10px;
	color: pink;
}
a {
	@media (min-width: 100px) {}
	display: none;
}
a {
	--width: 10px;
	@media (min-width: 100px) {}
	display: none;
	$height: 20px;
	span {}
}
```

After:

```css
a {
	--height: 10px;
	top: 0;
	color: pink;
}
a {
	display: none;
	@media (min-width: 100px) {}
}
a {
	--width: 10px;
	$height: 20px;
	display: none;
	span {}
	@media (min-width: 100px) {}
}
```

---

Given:

```js
[
	{
		type: 'at-rule',
		name: 'include',
	},
	{
		type: 'at-rule',
		name: 'include',
		hasBlock: true
	},
	{
		type: 'at-rule',
		hasBlock: true
	},
	{
		type: 'at-rule',
	}
]
```

Before:

```scss
a {
	@include hello {
		display: block;
	}
	@include hello;
}

a {
	@extend .something;
	@media (min-width: 10px) {
		display: none;
	}
}

a {
	@include hello {
		display: block;
	}
	@include hello;
	@media (min-width: 10px) {
		display: none;
	}
	@extend .something;
}
```

After:

```scss
a {
	@include hello;
	@include hello {
		display: block;
	}
}

a {
	@media (min-width: 10px) {
		display: none;
	}
	@extend .something;
}

a {
	@include hello;
	@include hello {
		display: block;
	}
	@media (min-width: 10px) {
		display: none;
	}
	@extend .something;
}
```

---

Given:

```js
[
	{
		type: 'at-rule',
		name: 'include',
		hasBlock: true
	},
	{
		type: 'at-rule',
		name: 'include',
		parameter: 'icon',
		hasBlock: true
	},
	{
		type: 'at-rule',
		name: 'include',
		parameter: 'icon'
	}
]
```

Before:

```scss
a {
	@include icon {
		display: block;
	}
	@include hello {
		display: none;
	}
	@include icon;
}

a {
	@include icon;
	@include icon {
		display: block;
	}
}
```

After:

```scss
a {
	@include icon {
		display: block;
	}
	@include hello {
		display: none;
	}
	@include icon;
}

a {
	@include icon;
	@include icon {
		display: block;
	}
}
```

---

Given:

```js
[
	'custom-properties',
	{
		type: 'at-rule',
		hasBlock: true,
	},
	'declarations'
]
```

Before:

```css
a {
	@media (min-width: 10px) {
		display: none;
	}
	--height: 10px;
	width: 20px;
}

a {
	width: 20px;
	@media (min-width: 10px) {
		display: none;
	}
	--height: 10px;
}

a {
	width: 20px;
	@media (min-width: 10px) {
		display: none;
	}
}
```

After:

```css
a {
	--height: 10px;
	@media (min-width: 10px) {
		display: none;
	}
	width: 20px;
}

a {
	--height: 10px;
	@media (min-width: 10px) {
		display: none;
	}
	width: 20px;
}

a {
	@media (min-width: 10px) {
		display: none;
	}
	width: 20px;
}
```
