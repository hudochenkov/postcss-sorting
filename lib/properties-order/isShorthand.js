import { shorthandData } from './shorthandData.js';

/** @type {Map<string, Set<string>>} */
const allLonghandsCache = new Map();

/**
 * @param {string} property
 * @param {Set<string>} [longhands]
 * @returns {Set<string>}
 */
function collectLonghands(property, longhands = new Set()) {
	for (const longhand of shorthandData[property] ?? []) {
		if (!longhands.has(longhand)) {
			longhands.add(longhand);
			collectLonghands(longhand, longhands);
		}
	}

	return longhands;
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function isShorthand(a, b) {
	if (!shorthandData[a]) {
		return false;
	}

	let longhands = allLonghandsCache.get(a);

	if (!longhands) {
		longhands = collectLonghands(a);
		allLonghandsCache.set(a, longhands);
	}

	return longhands.has(b);
}
