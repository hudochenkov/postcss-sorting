'use strict';

test(
	`Should do nothing if config is undefined`,
	() => runTest('empty-lines-preserve')
);

groupTest([
	{
		description: 'Empty lines should be cleaned before any other empty-line-before option',
		options: {
			'at-rule-nested-empty-line-before': true,
			'clean-empty-lines': true,
		},
		cases: [
			{
				fixture: `
					a {


						@mixin foo;


					}
				`,
				expected: `
					a {

						@mixin foo;
					}
				`,
			},
			{
				fixture: `
					a {
						@mixin foo;

					}
				`,
				expected: `
					a {

						@mixin foo;
					}
				`,
			},
		],
	},
]);
