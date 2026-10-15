import { isShorthand } from './isShorthand.js';
import { isDeclarationData } from './isDeclarationData.js';
import * as vendor from './vendor.js';

/** @import { PropertyData } from '../types.js' */

/**
 * @param {PropertyData} a
 * @param {PropertyData} b
 * @returns {number}
 */
export function sortDeclarationsAlphabetically(a, b) {
	if (isShorthand(a.unprefixedName, b.unprefixedName)) {
		return -1;
	}

	if (isShorthand(b.unprefixedName, a.unprefixedName)) {
		return 1;
	}

	if (a.unprefixedName === b.unprefixedName) {
		if (isDeclarationData(a) && isDeclarationData(b)) {
			// If first property has no prefix and second property has prefix
			if (!vendor.prefix(a.name).length && vendor.prefix(b.name).length) {
				return 1;
			}

			if (vendor.prefix(a.name).length && !vendor.prefix(b.name).length) {
				return -1;
			}
		}

		return a.initialIndex - b.initialIndex;
	}

	return a.unprefixedName <= b.unprefixedName ? -1 : 1;
}
