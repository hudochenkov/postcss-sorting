# dollar-variable-empty-line-before

Specify an empty line before `$`-variable declarations.

## Primary option

`boolean`: `true|false`

### `true`

Before:

```scss
a {
	top: 10px;
	$foo: pink;
	$bar: red;
}
```

After:

```scss
a {
	top: 10px;

	$foo: pink;

	$bar: red;
}
```

### `false`

Before:

```scss
a {
	top: 10px;

	$foo: pink;

	$bar: red;
}
```

```scss
a {

	$foo: pink;
	$bar: red;
}
```

After:

```scss
a {
	top: 10px;
	$foo: pink;
	$bar: red;
}
```

```scss
a {
	$foo: pink;
	$bar: red;
}
```

## Optional secondary options

```js
[
	"<primary option>",
	{
		except: ["after-comment", "after-dollar-variable", "first-nested"],
		ignore: ["after-comment", "inside-single-line-block"]
	}
]
```

### `except: ["after-comment", "after-dollar-variable", "first-nested"]`

#### `"after-comment"`

Reverse the primary option for `$`-variable declarations that come after a comment.

Given:

```js
[true, { except: ["after-comment"] }]
```

Before:

```scss
a {

	$foo: pink;
	/* comment */

	$bar: red;
}
```

After:

```scss
a {

	$foo: pink;
	/* comment */
	$bar: red;
}

```

#### `"after-dollar-variable"`

Reverse the primary option for `$`-variable declarations that come after another `$`-variable declaration.

Given:

```js
[true, { except: ["after-dollar-variable"] }]
```

Before:

```scss
a {

	$foo: pink;

	$bar: red;
}
```

After:

```scss
a {

	$foo: pink;
	$bar: red;
}
```

#### `"first-nested"`

Reverse the primary option for `$`-variable declarations that are nested and the first child of their parent node.

Given:

```js
[true, { except: ["first-nested"] }]
```

Before:

```scss
a {

	$foo: pink;

	$bar: red;
}
```

After:

```scss
a {
	$foo: pink;

	$bar: red;
}
```

### `ignore: ["after-comment", "inside-single-line-block"]`

#### `"after-comment"`

Ignore `$`-variable declarations that are preceded by comments.

Given:

```js
[true, { ignore: ["after-comment"] }]
```

```scss
a {
	/* comment */
	$foo: pink;
}
```

#### `"inside-single-line-block"`

Ignore `$`-variable declarations that are inside single-line blocks.

Given:

```js
[true, { ignore: ["inside-single-line-block"] }]
```

```scss
a { $foo: pink; $bar: red; }
```
