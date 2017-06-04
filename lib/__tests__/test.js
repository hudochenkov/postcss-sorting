'use strict';

test(
	`Should do nothing if config is undefined`,
	() => runTest('empty-lines-preserve', undefined, __dirname)
);
