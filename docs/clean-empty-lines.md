# clean-empty-lines

Remove all empty lines. Runs before all other rules.

`boolean`: `true|false`

By default it's disabled.

Given:

```js
{ 'clean-empty-lines': true }
```

Before:

```css
a {


	/* comment 3 */



	display: block;


	position: absolute;
	top: 100%;
	right: 50%;
	@extend .something;


	@mixin hiya {
		display: none;
	}
	@include hello;


}
```

After:

```css
a {
	/* comment 3 */
	display: block;
	position: absolute;
	top: 100%;
	right: 50%;
	@extend .something;
	@mixin hiya {
		display: none;
	}
	@include hello;
}
```
