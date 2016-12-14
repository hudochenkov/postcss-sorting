'use strict';

module.exports = function countEmptyLines(str) {
	let lineBreaks = (str.match(/\n/g) || []).length;

	if (lineBreaks > 0) {
		lineBreaks -= 1;
	}

	return lineBreaks;
};
