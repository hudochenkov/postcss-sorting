const plugin = require('../..');
const postcss = require('postcss');

test(`Should do nothing if config is undefined`, () => {
	runTest('empty-lines-preserve', undefined, __dirname);
});

test(`Should throw an error if config has error`, () => {
	const opts = {
		'throw-validate-errors': true,
		order: 'Justice Rains From Above',
	};

	return expect(postcss([plugin(opts)]).process('', { from: undefined })).rejects.toThrow(
		'postcss-sorting: order: Should be an array',
	);
});
