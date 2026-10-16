import { sortDeclarationsAlphabetically } from './sortDeclarationsAlphabetically.js';
import { isDeclarationData } from './isDeclarationData.js';

/** @import { PropertyData } from '../types.js' */

/**
 * @param {PropertyData} a
 * @param {PropertyData} b
 * @returns {number}
 */
export function sortDeclarations(a, b) {
	// If unprefixed prop names are the same, compare the prefixed versions
	if (isDeclarationData(a) && isDeclarationData(b) && a.unprefixedName === b.unprefixedName) {
		// If first property has no prefix and second property has prefix
		if (!a.hasVendorPrefix && b.hasVendorPrefix) {
			return 1;
		}

		if (a.hasVendorPrefix && !b.hasVendorPrefix) {
			return -1;
		}
	}

	if (a.orderData && b.orderData !== undefined) {
		// If a and b have the same group index, and a's property index is
		// higher than b's property index, in a sorted list a appears after
		// b:
		if (a.orderData.propertyIndex !== b.orderData.propertyIndex) {
			return a.orderData.propertyIndex - b.orderData.propertyIndex;
		}
	}

	if (
		a.unspecifiedPropertiesPosition === 'bottom' ||
		a.unspecifiedPropertiesPosition === 'bottomAlphabetical' ||
		b.unspecifiedPropertiesPosition === 'bottomAlphabetical'
	) {
		if (a.orderData !== undefined && b.orderData === undefined) {
			return -1;
		}

		if (a.orderData === undefined && b.orderData !== undefined) {
			return 1;
		}
	}

	if (a.unspecifiedPropertiesPosition === 'top') {
		if (a.orderData !== undefined && b.orderData === undefined) {
			return 1;
		}

		if (a.orderData === undefined && b.orderData !== undefined) {
			return -1;
		}
	}

	if (a.unspecifiedPropertiesPosition === 'bottomAlphabetical') {
		if (a.orderData === undefined && b.orderData === undefined) {
			return sortDeclarationsAlphabetically(a, b);
		}
	}

	// If a and b have the same group index and the same property index,
	// in a sorted list they appear in the same order they were in
	// original array:
	return a.initialIndex - b.initialIndex;
}
