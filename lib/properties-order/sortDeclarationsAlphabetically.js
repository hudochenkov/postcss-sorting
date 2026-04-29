import { isShorthand } from './isShorthand.js';
import * as vendor from './vendor.js';

export function sortDeclarationsAlphabetically(a, b) {
	if (isShorthand(a.unprefixedName, b.unprefixedName)) {
		return -1;
	}

	if (isShorthand(b.unprefixedName, a.unprefixedName)) {
		return 1;
	}

	if (a.unprefixedName === b.unprefixedName) {
		if (a.node.type === 'decl' && b.node.type === 'decl') {
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
