import postcssSorting from '../../index.js';
import postcss from 'postcss';

test(`Should do nothing if config is undefined`, () => {
	return runTest('empty-lines-preserve', undefined);
});

test(`Should throw an error if config has error`, () => {
	const opts = {
		'throw-validate-errors': true,
		order: 'Justice Rains From Above',
	};

	return expect(
		// @ts-expect-error -- invalid config on purpose
		postcss([postcssSorting(opts)]).process('', { from: undefined }),
	).rejects.toThrow('postcss-sorting: order: Should be an array');
});
