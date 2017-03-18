'use strict';

test(
	'Should remove empty lines',
	() => runTest('empty-lines-remove',
		{
			'clean-empty-lines': true,
		}
	)
);

test(
	`Shouldn't mess with line breaks`,
	() => runTest('empty-lines-preserve-1',
		{
			'clean-empty-lines': true,
		}
	)
);

test(
	`Shouldn't remove empty lines`,
	() => runTest('empty-lines-preserve-2',
		{
			'clean-empty-lines': false,
		}
	)
);
