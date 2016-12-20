'use strict';

const postcss = require('postcss');
const test = require('ava');
const plugin = require('../');

module.exports = function (testGroups) {
	testGroups.forEach((group) => {
		const message = group.message || `Should work with ${JSON.stringify(group.options)}`;

		group.cases.forEach((item) => {
			const testFn = (item.only) ? test.only : test;

			testFn(
				message,
				(t) => postcss(plugin(group.options))
					.process(item.fixture)
					.then(({ css }) => {
						t.deepEqual(css, item.expected);
					})
			);
		});
	});
};
