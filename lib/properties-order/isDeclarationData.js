/** @import { DeclarationData, PropertyData } from '../types.js' */

/**
 * @param {PropertyData} data
 * @returns {data is DeclarationData}
 */
export function isDeclarationData(data) {
	return data.node.type === 'decl';
}
