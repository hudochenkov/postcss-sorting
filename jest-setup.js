'use strict';

const postcss = require('postcss');
const plugin = require('./');

global.groupTest = function (testGroups) {
	testGroups.forEach((group) => {
		group.cases.forEach((item) => {
			const message = item.description || group.message || `Should work with ${JSON.stringify(group.options)}`;
			const testFn = item.only ? test.only : test;

			testFn(
				message,
				() => postcss(plugin(group.options))
					.process(item.fixture)
					.then((root) => {
						expect(root.css).toEqual(item.expected);
					})
			);
		});
	});
};
