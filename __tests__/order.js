'use strict';

const config = {
	order: [
		'declarations',
		'rules',
	],
};

test(
	'Should not remove comments in rules if they are only children',
	() => runTest('rules-with-comments-only', config)
);

test(
	`Should not remove first comment in the rule if it's not on separate line (order)`,
	() => runTest('first-comment-in-the-rule', config)
);

test(
	'Should not remove last comments in the rule',
	() => runTest('last-comments', config)
);

test(
	'Should assign comments before and after nodes correctly (order)',
	() => runTest('nodes-comments.css',
		{
			order: [
				'custom-properties',
				'dollar-variables',
				'declarations',
			],
		}
	)
);

test(
	'Should sort by keywords',
	() => runTest('keywords',
		{
			order: [
				'custom-properties',
				'dollar-variables',
				'declarations',
				'rules',
				'at-rules',
			],
		}
	)
);

test(
	'At-rules combination from most specified to least specified',
	() => runTest('at-rules',
		{
			order: [
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
				},
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
				},
				{
					type: 'at-rule',
					hasBlock: true,
				},
				{
					type: 'at-rule',
				},
			],
		}
	)
);

test(
	'At-rules mixed combination',
	() => runTest('at-rules-mixed',
		{
			order: [
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
				},
				{
					type: 'at-rule',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
				},
				{
					type: 'at-rule',
					name: 'include',
					parameter: 'media',
					hasBlock: true,
				},
			],
		}
	)
);

test(
	'Should sort inside nested rules',
	() => runTest('nested-rule',
		{
			order: [
				'custom-properties',
				'declarations',
				'rules',
			],
		}
	)
);

test(
	'Should sort inside nested at-rules',
	() => runTest('nested-at-rule',
		{
			order: [
				'custom-properties',
				'declarations',
				'at-rules',
			],
		}
	)
);

test(
	'Should move unspecified nodes to the bottom',
	() => runTest('unspecified-nodes',
		{
			order: [
				'custom-properties',
				'declarations',
			],
		}
	)
);

test(
	'Should preserve indentation',
	() => runTest('indent',
		{
			order: [
				'declarations',
				'rules',
				'at-rules',
			],
		}
	)
);
