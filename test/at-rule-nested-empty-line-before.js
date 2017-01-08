import groupTest from './_group-test';

function mergeTestCases(first, second) {
	return first.concat(second);
}

const sharedAlwaysTests = [
	{
		fixture: 'z {a {} b {}}',
		expected: 'z {a {} b {}}',
	},
	{
		fixture: 'z {@font-face {}}',
		expected: 'z {\n\n@font-face {}}',
	},
	{
		fixture: 'z {a {}\n\n@media {}}',
		expected: 'z {a {}\n\n@media {}}',
	},
	{
		fixture: 'z {a {}\n\n@mEdIa {}}',
		expected: 'z {a {}\n\n@mEdIa {}}',
	},
	{
		fixture: 'z {a {}\n\n@MEDIA {}}',
		expected: 'z {a {}\n\n@MEDIA {}}',
	},
	{
		fixture: 'z {@keyframes foo {}\n\n@media {}}',
		expected: 'z {\n\n@keyframes foo {}\n\n@media {}}',
	},
	{
		fixture: 'z {@kEyFrAmEs foo {}\n\n@MeDia {}}',
		expected: 'z {\n\n@kEyFrAmEs foo {}\n\n@MeDia {}}',
	},
	{
		fixture: 'z {@KEYFRAMES foo {}\n\n@MEDIA {}}',
		expected: 'z {\n\n@KEYFRAMES foo {}\n\n@MEDIA {}}',
	},
	{
		fixture: 'z {@-webkit-keyframes foo {}\n\n@media {}}',
		expected: 'z {\n\n@-webkit-keyframes foo {}\n\n@media {}}',
	},
	{
		fixture: 'z {@-webkit-keyframes foo {}\n\n@-webkit-keyframes bar {}}',
		expected: 'z {\n\n@-webkit-keyframes foo {}\n\n@-webkit-keyframes bar {}}',
	},
	{
		fixture: 'z {a {}\r\n\r\n@media {}}',
		expected: 'z {a {}\r\n\r\n@media {}}',
	},
	{
		fixture: 'z {a {}\n\r\n@media {}}',
		expected: 'z {a {}\n\r\n@media {}}',
	},

	{
		fixture: 'z {a {} @media {}}',
		expected: 'z {a {}\n\n @media {}}',
	},
	{
		fixture: 'z {a {} @mEdIa {}}',
		expected: 'z {a {}\n\n @mEdIa {}}',
	},
	{
		fixture: 'z {a {} @MEDIA {}}',
		expected: 'z {a {}\n\n @MEDIA {}}',
	},
	{
		fixture: 'z {@keyframes foo {} @media {}}',
		expected: 'z {\n\n@keyframes foo {}\n\n @media {}}',
	},
	{
		fixture: 'z {@-webkit-keyframes foo {} @media {}}',
		expected: 'z {\n\n@-webkit-keyframes foo {}\n\n @media {}}',
	},
	{
		fixture: 'z {@-webkit-keyframes foo {} @-webkit-keyframes bar {}}',
		expected: 'z {\n\n@-webkit-keyframes foo {}\n\n @-webkit-keyframes bar {}}',
	},
	{
		fixture: 'z {a {}\n@media {}}',
		expected: 'z {a {}\n\n@media {}}',
	},
	{
		fixture: 'z {a {}\r\n@media {}}',
		expected: 'z {a {}\n\r\n@media {}}',
	},
	{
		fixture: 'z {a {}\n\n/* comment */\n@media {}}',
		expected: 'z {a {}\n\n/* comment */\n\n@media {}}',
	},
	{
		fixture: 'z {a {}\r\n\r\n/* comment */\r\n@media {}}',
		expected: 'z {a {}\r\n\r\n/* comment */\n\r\n@media {}}',
	},
];

const sharedNeverTests = [
	{
		fixture: 'z {a {}\n\nb {}}',
		expected: 'z {a {}\n\nb {}}',
	},
	{
		fixture: 'z {\n\n@font-face {}}',
		expected: 'z {\n@font-face {}}',
	},
	{
		fixture: 'z {a {}\n@media {}}',
		expected: 'z {a {}\n@media {}}',
	},
	{
		fixture: 'z {a {} @media {}}',
		expected: 'z {a {} @media {}}',
	},
	{
		fixture: 'z {@keyframes foo {}\n@media {}}',
		expected: 'z {@keyframes foo {}\n@media {}}',
	},
	{
		fixture: 'z {@keyframes foo {} @media {}}',
		expected: 'z {@keyframes foo {} @media {}}',
	},

	{
		fixture: 'z {a {}\n\n@media {}}',
		expected: 'z {a {}\n@media {}}',
	},
	{
		fixture: 'z {@keyframes foo {}\n/* comment */\n\n@media {}}',
		expected: 'z {@keyframes foo {}\n/* comment */\n@media {}}',
	},
];

groupTest([
	{
		options: {
			'at-rule-nested-empty-line-before': true
		},
		cases: mergeTestCases(sharedAlwaysTests, [
			{
				fixture: 'a {\n\n  @mixin foo;\n}',
				expected: 'a {\n\n  @mixin foo;\n}',
			},
		]),
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { except: ['blockless-group'] }]
		},
		cases: mergeTestCases(sharedAlwaysTests, [
			{
				fixture: `z{a {\n\n  @mixin foo;\n}}`,
				expected: `z{a {\n\n  @mixin foo;\n}}`,
			},
			{
				fixture: `z{\n\n@keyframes foo {}\n\n@import 'x.css'}`,
				expected: `z{\n\n@keyframes foo {}\n\n@import 'x.css'}`,
				description: 'empty line not blockless pair',
			},
			{
				fixture: `z{@import 'x.css';\n@import 'y.css'}`,
				expected: `z{\n\n@import 'x.css';\n@import 'y.css'}`,
				description: 'no empty line blockless pair',
			},
			{
				fixture: `z{\n\n@import 'x.css';}`,
				expected: `z{\n\n@import 'x.css';}`,
				description: 'single blockless rule',
			},
			{
				fixture: `z{\n\n@keyframes foo {}\n@import 'x.css'}`,
				expected: `z{\n\n@keyframes foo {}\n\n@import 'x.css'}`,
			},
			{
				fixture: `z{@import 'x.css';\n\n@import 'y.css'}`,
				expected: `z{\n\n@import 'x.css';\n@import 'y.css'}`,
			},
		]),
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { ignore: ['blockless-group'] }]
		},
		cases: mergeTestCases(sharedAlwaysTests, [
			{
				fixture: `z{\n\n@media {} @import 'x.css';}`,
				expected: `z{\n\n@media {}\n\n @import 'x.css';}`,
			},
			{
				fixture: `z{@import 'x.css';\n\n @media {}}`,
				expected: `z{\n\n@import 'x.css';\n\n @media {}}`,
			},
			{
				fixture: `z{@import 'test'; @include mixin(1) { @content; }}`,
				expected: `z{\n\n@import 'test';\n\n @include mixin(1) {\n\n @content; }}`,
			},
		]),
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'z{/* foo */\n@media {}}',
				expected: 'z{/* foo */\n\n@media {}}',
			},
			{
				fixture: 'z{/* foo */\n\n@media{}}',
				expected: 'z{/* foo */\n\n@media{}}',
			},
			{
				fixture: 'z{/* foo */\r\n\r\n@media {}}',
				expected: 'z{/* foo */\r\n\r\n@media {}}',
			},
			{
				fixture: 'z{a {} @media {}}',
				expected: 'z{a {}\n\n @media {}}',
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a {\n  @mixin foo;\n  color: pink;\n}',
				expected: 'a {\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				fixture: 'a {\n  color: pink;\n  @mixin foo;\n}',
				expected: 'a {\n  color: pink;\n\n  @mixin foo;\n}',
			},
			{
				fixture: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
				expected: 'a {\n  @mixin foo;\n  color: pink;\n}',
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': false
		},
		cases: mergeTestCases(sharedNeverTests, [
			{
				fixture: 'a {\n  @mixin foo;\n}',
				expected: 'a {\n  @mixin foo;\n}',
			},
		]),
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [false, { except: ['blockless-group'] }]
		},
		cases: mergeTestCases(sharedNeverTests, [
			{
				fixture: `z{a {\n  @mixin foo;\n}}`,
				expected: `z{a {\n  @mixin foo;\n}}`,
			},
			{
				fixture: `z{@keyframes foo {}\n@import 'x.css'}`,
				expected: `z{@keyframes foo {}\n@import 'x.css'}`,
			},
			{
				fixture: `z{@import 'x.css';\n\n@import 'y.css'}`,
				expected: `z{@import 'x.css';\n\n@import 'y.css'}`,
			},
			{
				fixture: `z{@import 'x.css';}`,
				expected: `z{@import 'x.css';}`,
			},
			{
				fixture: `z{@keyframes foo {}\n\n@import 'x.css'}`,
				expected: `z{@keyframes foo {}\n@import 'x.css'}`,
			},
			{
				fixture: `z{@import 'x.css';\n@import 'y.css'}`,
				expected: `z{@import 'x.css';\n\n@import 'y.css'}`,
			},
		]),
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [false, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
				expected: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
			},
			{
				fixture: 'a {\n  color: pink;\n\n  @mixin foo;\n}',
				expected: 'a {\n  color: pink;\n  @mixin foo;\n}',
			},
			{
				fixture: 'a {\n  @mixin foo;\n  color: pink;\n}',
				expected: 'a {\n\n  @mixin foo;\n  color: pink;\n}',
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [false, { ignore: ['blockless-group'] }]
		},
		cases: [
			{
				fixture: `z{
					@media {};

					@import 'x.css';
				}`,
				expected: `z{
					@media {};
					@import 'x.css';
				}`,
			},
			{
				fixture: `z{
					@import 'x.css';

					@import 'y.css';
				}`,
				expected: `z{
					@import 'x.css';

					@import 'y.css';
				}`,
			},
			{
				fixture: `z{
					@import 'x.css';

					@media {};
				}`,
				expected: `z{
					@import 'x.css';
					@media {};
				}`,
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [false, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'z{/* foo */\n@media {}}',
				expected: 'z{/* foo */\n@media {}}',
			},
			{
				fixture: 'z{/* foo */\r\na@media {}}',
				expected: 'z{/* foo */\r\na@media {}}',
			},
			{
				fixture: 'z{/* foo */\n\n@media {}}',
				expected: 'z{/* foo */\n@media {}}',
			},
			{
				fixture: 'z{b {}\n\n@media {}}',
				expected: 'z{b {}\n@media {}}',
			},
			{
				fixture: 'z{b {}\r\n\r\n@media {}}',
				expected: 'z{b {}\r\n@media {}}',
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { ignoreAtRules: ['else'] }]
		},
		cases: [
			{
				fixture: `z{

					@if(true) {
					} @else {
					}
				}`,
				expected: `z{

					@if(true) {
					} @else {
					}
				}`,
			},
			{
				fixture: `z{

					@if(true) {
					}

					@else {
					}
				}`,
				expected: `z{

					@if(true) {
					}

					@else {
					}
				}`,
			},
			{
				fixture: `z{

					@if(true) {}
					@else if(true) {
					}  @else {
					}
				}`,
				expected: `z{

					@if(true) {}
					@else if(true) {
					}  @else {
					}
				}`,
			},
			{
				fixture: `z{

					@if(true) {
					}
					@else-mixin {
					}
				}`,
				expected: `z{

					@if(true) {
					}

					@else-mixin {
					}
				}`,
			},
			{
				fixture: `z{
					@if (true) {}
					@if (false) {
					}
				}`,
				expected: `z{

					@if (true) {}

					@if (false) {
					}
				}`,
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [false, { ignoreAtRules: ['else'] }]
		},
		cases: [
			{
				fixture: `z{
					@if(true) {
					} @else {
					}
				}`,
				expected: `z{
					@if(true) {
					} @else {
					}
				}`,
			},
			{
				fixture: `z{
					@if(true) {
					}

					@else {
					}
				}`,
				expected: `z{
					@if(true) {
					}

					@else {
					}
				}`,
			},
			{
				fixture: `z{
					@if(true) {}

					@else if(true) {}

					@else {}
				}`,
				expected: `z{
					@if(true) {}

					@else if(true) {}

					@else {}
				}`,
			},
			{
				fixture: `z{
					@if(true) {
					}

					@else-mixin {}
				}`,
				expected: `z{
					@if(true) {
					}
					@else-mixin {}
				}`,
			},
			{
				fixture: `z{
					@if (true)
					{}

					@if (false) {
					}
				}`,
				expected: `z{
					@if (true)
					{}
					@if (false) {
					}
				}`,
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { ignore: ['blockless-after-same-name-blockless'] }]
		},
		cases: [
			{
				fixture: `z{

					@charset "UTF-8";

					@import url(x.css);
					@import url(y.css);}`,
				expected: `z{

					@charset "UTF-8";

					@import url(x.css);
					@import url(y.css);}`,
			},
			{
				fixture: `
					z {

						@extends .foo;
						@extends .bar;

						@include loop;
						@include doo;
					}`,
				expected: `
					z {

						@extends .foo;
						@extends .bar;

						@include loop;
						@include doo;
					}`,
			},
			{
				fixture: `z{
					@charset "UTF-8";
					@import url(x.css);
					@import url(y.css);}`,
				expected: `z{

					@charset "UTF-8";

					@import url(x.css);
					@import url(y.css);}`,
			},
			{
				fixture: `
					z {

						@extends .foo;
						@extends .bar;
						@include loop;
						@include doo;
					}`,
				expected: `
					z {

						@extends .foo;
						@extends .bar;

						@include loop;
						@include doo;
					}`,
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { except: ['blockless-after-same-name-blockless'] }]
		},
		cases: [
			{
				fixture: `z{

					@charset "UTF-8";

					@import url(x.css);
					@import url(y.css);}`,
				expected: `z{

					@charset "UTF-8";

					@import url(x.css);
					@import url(y.css);}`,
			},
			{
				fixture: `
					z {

						@extends .foo;
						@extends .bar;

						@include loop;
						@include doo;
					}`,
				expected: `
					z {

						@extends .foo;
						@extends .bar;

						@include loop;
						@include doo;
					}`,
			},
			{
				fixture: `z{
					@charset "UTF-8";
					@import url(x.css);
					@import url(y.css);}`,
				expected: `z{

					@charset "UTF-8";

					@import url(x.css);
					@import url(y.css);}`,
			},
			{
				fixture: `
					z {

						@extends .foo;
						@extends .bar;
						@include loop;
						@include doo;
					}`,
				expected: `
					z {

						@extends .foo;
						@extends .bar;

						@include loop;
						@include doo;
					}`,
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [true, { except: ['after-same-name'] }]
		},
		cases: [
			{
				fixture: `z{

					@charset "UTF-8";

					@media (width: 100px) {}
					@media (width: 200px) {}}`,
				expected: `z{

					@charset "UTF-8";

					@media (width: 100px) {}
					@media (width: 200px) {}}`,
			},
			{
				fixture: `
					z {

						@extends .foo {}
						@extends .bar {}

						@include loop {}
						@include doo {}
					}`,
				expected: `
					z {

						@extends .foo {}
						@extends .bar {}

						@include loop {}
						@include doo {}
					}`,
			},
			{
				fixture: `z{
					@charset "UTF-8";
					@import url(x.css) {}
					@import url(y.css) {}}`,
				expected: `z{

					@charset "UTF-8";

					@import url(x.css) {}
					@import url(y.css) {}}`,
			},
			{
				fixture: `
					z {

						@extends .foo {}
						@extends .bar {}
						@include loop {}
						@include doo {}
					}`,
				expected: `
					z {

						@extends .foo {}
						@extends .bar {}

						@include loop {}
						@include doo {}
					}`,
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [false, { except: ['blockless-after-same-name-blockless'] }]
		},
		cases: [
			{
				fixture: `z{
					@charset "UTF-8";
					@import url(x.css);

					@import url(y.css);}`,
				expected: `z{
					@charset "UTF-8";
					@import url(x.css);

					@import url(y.css);}`,
			},
			{
				fixture: `
					z {
						@extends .foo;

						@extends .bar;
						@include loop;

						@include doo;
					}`,
				expected: `
					z {
						@extends .foo;

						@extends .bar;
						@include loop;

						@include doo;
					}`,
			},
			{
				fixture: `z{
					@charset "UTF-8";
					@import url(x.css);
					@import url(y.css);}`,
				expected: `z{
					@charset "UTF-8";
					@import url(x.css);

					@import url(y.css);}`,
			},
			{
				fixture: `
					a {
						@extends .bar;
						@include loop;
						@include doo;
					}`,
				expected: `
					a {
						@extends .bar;
						@include loop;

						@include doo;
					}`,
			},
		],
	},
	{
		options: {
			'at-rule-nested-empty-line-before': [false, { except: ['after-same-name'] }]
		},
		cases: [
			{
				fixture: `z{
					@charset "UTF-8";
					@import url(x.css) {}

					@import url(y.css) {}}`,
				expected: `z{
					@charset "UTF-8";
					@import url(x.css) {}

					@import url(y.css) {}}`,
			},
			{
				fixture: `
					z {
						@extends .foo {}

						@extends .bar {}
						@include loop {}

						@include doo {}
					}`,
				expected: `
					z {
						@extends .foo {}

						@extends .bar {}
						@include loop {}

						@include doo {}
					}`,
			},
			{
				fixture: `z{
					@charset "UTF-8";
					@import url(x.css) {}
					@import url(y.css) {}}`,
				expected: `z{
					@charset "UTF-8";
					@import url(x.css) {}

					@import url(y.css) {}}`,
			},
			{
				fixture: `
					a {
						@extends .bar {}
						@include loop {}
						@include doo {}
					}`,
				expected: `
					a {
						@extends .bar {}
						@include loop {}

						@include doo {}
					}`,
			},
		],
	},
]);
