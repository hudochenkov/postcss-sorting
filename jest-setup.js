import fs from 'node:fs';
import path from 'node:path';
import postcssSorting from './index.js';
import postcss from 'postcss';
import cssInJS from 'postcss-styled-syntax'; // eslint-disable-line import/no-extraneous-dependencies
import html from 'postcss-html'; // eslint-disable-line import/no-extraneous-dependencies

global.groupTest = function groupTest(testGroups) {
	testGroups.forEach((group) => {
		group.cases.forEach((item) => {
			const message =
				item.description ||
				group.message ||
				`Should work with ${JSON.stringify(group.options)}`;
			const testFn = item.only ? test.only : test;

			testFn(message, () =>
				postcss(postcssSorting(group.options))
					.process(item.fixture, { from: undefined })
					.then((root) => {
						expect(root.css).toEqual(item.expected);
					}),
			);
		});
	});
};

global.runTest = function runTest(input, opts) {
	const dir = path.join(path.dirname(expect.getState().testPath), './fixtures/');
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
	} catch {
		fs.writeFileSync(inputPath, inputCSS);
	}

	try {
		expectCSS = fs.readFileSync(expectPath, 'utf8');
	} catch {
		fs.writeFileSync(expectPath, expectCSS);
	}

	let syntax;

	if (inputExt === 'js') {
		syntax = cssInJS;
	}

	if (inputExt === 'html') {
		syntax = html;
	}

	return postcss([postcssSorting(opts)])
		.process(inputCSS, {
			from: inputPath,
			syntax,
		})
		.then((result) => {
			const actualCSS = result.css;

			fs.writeFileSync(actualPath, actualCSS);

			expect(result.css).toEqual(expectCSS);
			expect(result.warnings().length).toEqual(0);
		});
};
