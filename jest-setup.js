const fs = require('fs');
const path = require('path');
const plugin = require('./');
const postcss = require('postcss');

global.groupTest = function(testGroups) {
	testGroups.forEach(group => {
		group.cases.forEach(item => {
			const message =
				item.description || group.message || `Should work with ${JSON.stringify(group.options)}`;
			const testFn = item.only ? test.only : test;

			testFn(message, () =>
				postcss(plugin(group.options))
					.process(item.fixture)
					.then(root => {
						expect(root.css).toEqual(item.expected);
					})
			);
		});
	});
};

global.runTest = function(input, opts, dirname) {
	const dir = path.join(dirname, './fixtures/');
	const inputSplitted = input.split('.');
	let inputName = input;
	let inputExt = 'css';

	if (inputSplitted.length > 1) {
		[inputName, inputExt] = inputSplitted;
	}

	const inputPath = path.resolve(`${dir + inputName}.${inputExt}`);
	const expectPath = path.resolve(`${dir + inputName}.expected.${inputExt}`);
	const actualPath = path.resolve(`${dir + inputName}.actual.${inputExt}`);

	let inputCSS = '';
	let expectCSS = '';

	try {
		inputCSS = fs.readFileSync(inputPath, 'utf8');
	} catch (error) {
		fs.writeFileSync(inputPath, inputCSS);
	}

	try {
		expectCSS = fs.readFileSync(expectPath, 'utf8');
	} catch (error) {
		fs.writeFileSync(expectPath, expectCSS);
	}

	return postcss([plugin(opts)])
		.process(inputCSS)
		.then(result => {
			const actualCSS = result.css;

			fs.writeFileSync(actualPath, actualCSS);

			expect(result.css).toEqual(expectCSS);
			expect(result.warnings().length).toEqual(0);
		});
};
