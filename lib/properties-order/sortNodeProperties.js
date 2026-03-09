let createExpectedPropertiesOrder = require('./createExpectedPropertiesOrder');
let getComments = require('../getComments');
let getPropertiesOrderData = require('./getPropertiesOrderData');
let isCustomProperty = require('../isCustomProperty');
let isAllowedToProcess = require('../isAllowedToProcess');
let isStandardSyntaxProperty = require('../isStandardSyntaxProperty');
let sortDeclarations = require('./sortDeclarations');
let sortDeclarationsAlphabetically = require('./sortDeclarationsAlphabetically');
let vendor = require('./vendor');

function isSortableDeclaration(childNode) {
	return (
		childNode.type === 'decl' &&
		isStandardSyntaxProperty(childNode.prop) &&
		!isCustomProperty(childNode.prop)
	);
}

function getNormalizedPropName(propName) {
	let unprefixedPropName = vendor.unprefixed(propName).toLowerCase();

	// Hack to allow -moz-osx-font-smoothing to be understood
	// just like -webkit-font-smoothing
	if (unprefixedPropName.indexOf('osx-') === 0) {
		return unprefixedPropName.slice(4);
	}

	return unprefixedPropName;
}

// eslint-disable-next-line max-params
function addCommentIndices(processedIndices, index, commentsBefore, commentsAfter) {
	if (commentsBefore.length) {
		for (let i = 1; i <= commentsBefore.length; i++) {
			processedIndices.add(index - i);
		}
	}

	if (commentsAfter.length) {
		for (let i = 1; i <= commentsAfter.length; i++) {
			processedIndices.add(index + i);
		}
	}
}

function replaceChildren(node, children) {
	node.removeAll();
	node.append(children);
}

module.exports = function sortNodeProperties(node, { order, unspecifiedPropertiesPosition }) {
	if (!isAllowedToProcess(node, { ignoreInterpolations: true })) {
		return;
	}

	let isAlphabetical = order === 'alphabetical';
	let expectedOrder = isAlphabetical ? null : createExpectedPropertiesOrder(order);

	let declarations = [];
	const processedIndices = new Set();
	const propDataByIndex = new Map();

	node.each((childNode, index) => {
		if (!isSortableDeclaration(childNode)) {
			return;
		}

		let unprefixedPropName = getNormalizedPropName(childNode.prop);
		let propData = {
			name: childNode.prop,
			unprefixedName: unprefixedPropName,
			orderData: isAlphabetical
				? null
				: getPropertiesOrderData(expectedOrder, unprefixedPropName),
			node: childNode,
			initialIndex: index,
			unspecifiedPropertiesPosition,
		};

		processedIndices.add(index);
		propDataByIndex.set(index, propData);

		// If comment on separate line before node, use node's indexes for comment
		let commentsBefore = getComments.beforeDeclaration([], childNode.prev(), propData);

		// If comment on same line with the node and node, use node's indexes for comment
		let commentsAfter = getComments.afterDeclaration([], childNode.next(), propData);

		addCommentIndices(processedIndices, index, commentsBefore, commentsAfter);
		declarations = [...declarations, ...commentsBefore, propData, ...commentsAfter];
	});

	if (isAllowedToProcess(node)) {
		if (isAlphabetical) {
			declarations.sort(sortDeclarationsAlphabetically);
		} else {
			declarations.sort(sortDeclarations);
		}

		let allRuleNodes = [];
		let foundDeclarations = false;

		node.each((childNode, index) => {
			if (processedIndices.has(index)) {
				if (!foundDeclarations) {
					foundDeclarations = true;

					declarations.forEach((item) => {
						allRuleNodes.push(item.node);
					});
				}
			} else {
				allRuleNodes.push(childNode);
			}
		});

		replaceChildren(node, allRuleNodes);

		return;
	}

	let allRuleNodes = [];
	let currentGroup = [];

	function sortGroup() {
		if (!currentGroup.length) {
			return;
		}

		const originalFirst = currentGroup[0].node;
		const barrierRaws = originalFirst.raws.before;

		if (isAlphabetical) {
			currentGroup.sort(sortDeclarationsAlphabetically);
		} else {
			currentGroup.sort(sortDeclarations);
		}

		const newFirst = currentGroup[0].node;

		if (newFirst !== originalFirst) {
			const temp = newFirst.raws.before;

			newFirst.raws.before = barrierRaws;
			originalFirst.raws.before = temp;
		}

		currentGroup.forEach((item) => {
			allRuleNodes.push(item.node);
		});

		currentGroup = [];
	}

	node.each((childNode, index) => {
		const data = propDataByIndex.get(index);

		if (data && childNode.type === 'decl') {
			if (childNode.raws.before && childNode.raws.before.includes('${')) {
				sortGroup();
			}

			currentGroup.push(data);
		} else {
			sortGroup();
			allRuleNodes.push(childNode);
		}
	});

	sortGroup();
	replaceChildren(node, allRuleNodes);
};
