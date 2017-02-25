'use strict';

const postcss = require('postcss');
const test = require('ava');
const plugin = require('../');

module.exports = function (testGroups) {
	testGroups.forEach((group) => {
		group.cases.forEach((item) => {
			const message = item.description || group.message || `Should work with ${JSON.stringify(group.options)}`;
			const testFn = (item.only) ? test.only : test;

			testFn(
				message,
				(t) => postcss(plugin(group.options))
					.process(item.fixture)
					.then((root) => {
						t.deepEqual(root.css, item.expected);
					})
			);
		});
	});
};
