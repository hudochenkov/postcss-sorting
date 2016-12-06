const postcss = require('postcss');
const _ = require('lodash');

module.exports = postcss.plugin('postcss-sorting', function (opts) {
	return function (css) {
		plugin(css, opts);
	};
});

function plugin(css, opts) {
	if (!validateOptions(opts)) {
		return;
	}

	if (opts.order) {
		const expectedOrder = createExpectedOrder(opts.order);

		css.walk(function (node) {
			// Process only rules and atrules with nodes
			if (isRuleWithNodes(node)) {
				// Nodes for sorting
				let processed = [];

				// Add indexes to nodes
				node.each(function (childNode, index) {
					processed = processMostNodes(childNode, index, expectedOrder, processed);
				});

				// Add last comments in the rule. Need this because last comments are not belonging to anything
				node.each(function (childNode, index) {
					processed = processLastComments(childNode, index, processed);
				});

				// Sort declarations saved for sorting
				processed.sort(sortByIndexes);

				// Enforce semicolon for the last node
				node.raws.semicolon = true;

				// Replace rule content with sorted one
				node.removeAll();
				node.append(processed);
			}
		});
	}
}

function processMostNodes(node, index, order, processedNodes) {
	if (node.type === 'comment') {
		return processedNodes;
	}

	const nodeOrderData = getOrderData(order, node);

	node.position = nodeOrderData && nodeOrderData.position ? nodeOrderData.position : Infinity;
	node.initialIndex = index;

	// If comment on separate line before node, use node's indexes for comment
	const commentsBefore = getAllCommentsBeforeNode([], node.prev(), node);

	// If comment on same line with the node and node, use node's indexes for comment
	const commentsAfter = getAllCommentsAfterNode([], node.next(), node);

	return processedNodes.concat(commentsBefore, node, commentsAfter);
}

function validateOptions(options) {
	if (!_.isPlainObject(options)) {
		throw new Error('Options should be an object.');
	}

	if (!_.isUndefined(options.order) && !validateOrder(options.order)) {
		return false;
	}

	if (!_.isUndefined(options['properties-order'])) {
		// placeholder
	}

	return true;
}

function validateOrder(options) {
	// Otherwise, begin checking array options
	if (!Array.isArray(options)) {
		return false;
	}

	// Every item in the array must be a certain string or an object
	// with a "type" property
	if (!options.every((item) => {
		if (_.isString(item)) {
			return _.includes(['custom-properties', 'dollar-variables', 'declarations', 'rules', 'at-rules'], item);
		}

		return _.isPlainObject(item) && !_.isUndefined(item.type);
	})) {
		return false;
	}

	const objectItems = options.filter(_.isPlainObject);

	if (!objectItems.every((item) => {
		let result = true;

		if (item.type !== 'at-rule') {
			return false;
		}

		// if parameter is specified, name should be specified also
		if (!_.isUndefined(item.parameter) && _.isUndefined(item.name)) {
			return false;
		}

		if (!_.isUndefined(item.hasBlock)) {
			result = item.hasBlock === true || item.hasBlock === false;
		}

		if (!_.isUndefined(item.name)) {
			result = _.isString(item.name) && item.name.length;
		}

		if (!_.isUndefined(item.parameter)) {
			result = (_.isString(item.parameter) && item.parameter.length) || _.isRegExp(item.parameter);
		}

		return result;
	})) {
		return false;
	}

	return true;
}

function createExpectedOrder(input) {
	const order = {};
	let position = 0;

	input.forEach((item) => {
		position += 1;

		if (_.isString(item) && item !== 'at-rules') {
			order[item] = {
				position
			};
		} else {
			// If it's an object
			// Currently 'at-rules' only

			// Convert 'at-rules' into extended pattern
			if (item === 'at-rules') {
				item = {
					type: 'at-rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order[item.type]) {
				order[item.type] = [];
			}

			const nodeData = {
				position,
			};

			if (item.name) {
				nodeData.name = item.name;
			}

			if (item.parameter) {
				nodeData.parameter = item.parameter;

				if (_.isString(item.parameter)) {
					nodeData.parameter = new RegExp(item.parameter);
				}
			}

			if (item.hasBlock) {
				nodeData.hasBlock = item.hasBlock;
			}

			order[item.type].push(nodeData);
		}
	});

	return order;
}

function getOrderData(expectedOrder, node) {
	let nodeType;

	if (node.type === 'decl') {
		if (isCustomProperty(node.prop)) {
			nodeType = 'custom-properties';
		} else if (isDollarVariable(node.prop)) {
			nodeType = 'dollar-variables';
		} else if (isStandardSyntaxProperty(node.prop)) {
			nodeType = 'declarations';
		}
	} else if (node.type === 'rule') {
		nodeType = 'rules';
	} else if (node.type === 'atrule') {
		nodeType = {
			type: 'at-rule',
			name: node.name,
			hasBlock: false
		};

		if (node.nodes && node.nodes.length) {
			nodeType.hasBlock = true;
		}

		if (node.params && node.params.length) {
			nodeType.parameter = node.params;
		}

		const atRules = expectedOrder['at-rule'];

		// Looking for most specified pattern, because it can match many patterns
		if (atRules && atRules.length) {
			let prioritizedPattern;
			let max = 0;

			atRules.forEach(function (pattern) {
				const priority = calcPatternPriority(pattern, nodeType);

				if (priority > max) {
					max = priority;
					prioritizedPattern = pattern;
				}
			});

			if (max) {
				return prioritizedPattern;
			}
		}
	}

	if (expectedOrder[nodeType]) {
		return expectedOrder[nodeType];
	}

	// Return null if there no patterns for that node
	return null;
}

function calcPatternPriority(pattern, node) {
	// 0 — it pattern doesn't match
	// 1 — pattern without `name` and `hasBlock`
	// 10010 — pattern match `hasBlock`
	// 10100 — pattern match `name`
	// 20110 — pattern match `name` and `hasBlock`
	// 21100 — patter match `name` and `parameter`
	// 31110 — patter match `name`, `parameter`, and `hasBlock`

	let priority = 0;

	// match `hasBlock`
	if (pattern.hasOwnProperty('hasBlock') && node.hasBlock === pattern.hasBlock) {
		priority += 10;
		priority += 10000;
	}

	// match `name`
	if (pattern.hasOwnProperty('name') && node.name === pattern.name) {
		priority += 100;
		priority += 10000;
	}

	// match `name`
	if (pattern.hasOwnProperty('parameter') && pattern.parameter.test(node.parameter)) {
		priority += 1100;
		priority += 10000;
	}

	// doesn't have `name` and `hasBlock`
	if (!pattern.hasOwnProperty('hasBlock') && !pattern.hasOwnProperty('name') && !pattern.hasOwnProperty('paremeter')) {
		priority = 1;
	}

	// patter has `name` and `hasBlock`, but it doesn't match both properties
	if (pattern.hasOwnProperty('hasBlock') && pattern.hasOwnProperty('name') && priority < 20000) {
		priority = 0;
	}

	// patter has `name` and `parameter`, but it doesn't match both properties
	if (pattern.hasOwnProperty('name') && pattern.hasOwnProperty('parameter') && priority < 21100) {
		priority = 0;
	}

	// patter has `name`, `parameter`, and `hasBlock`, but it doesn't match all properties
	if (pattern.hasOwnProperty('name') && pattern.hasOwnProperty('parameter') && pattern.hasOwnProperty('hasBlock') && priority < 30000) {
		priority = 0;
	}

	return priority;
}

function isDollarVariable(property) {
	return property[0] === '$';
}

function isCustomProperty(property) {
	return property.slice(0, 2) === '--';
}

function isStandardSyntaxProperty(property) {
	// SCSS var (e.g. $var: x), list (e.g. $list: (x)) or map (e.g. $map: (key:value))
	if (property[0] === '$') {
		return false;
	}

	// Less var (e.g. @var: x)
	if (property[0] === '@') {
		return false;
	}

	// SCSS or Less interpolation
	if (/#{.+?}|@{.+?}|\$\(.+?\)/.test(property)) {
		return false;
	}

	return true;
}

function sortByIndexes(a, b) {
	// If a and b have the same group index, and a's property index is
	// higher than b's property index, in a sorted list a appears after
	// b:
	if (a.position !== b.position) {
		return a.position - b.position;
	}

	// If a and b have the same group index and the same property index,
	// in a sorted list they appear in the same order they were in
	// original array:
	return a.initialIndex - b.initialIndex;
}

function getAllCommentsBeforeNode(comments, previousNode, node, currentInitialIndex) {
	if (!previousNode || previousNode.type !== 'comment') {
		return comments;
	}

	if (
		!previousNode.raws.before ||
		(previousNode.raws.before.indexOf('\n') === -1 && previousNode.prev())
	) {
		return comments;
	}

	currentInitialIndex = currentInitialIndex || node.initialIndex;

	previousNode.position = node.position;
	previousNode.initialIndex = currentInitialIndex - 0.0001;

	const newComments = [previousNode].concat(comments);

	return getAllCommentsBeforeNode(newComments, previousNode.prev(), node, previousNode.initialIndex);
}

function getAllCommentsAfterNode(comments, nextNode, node, currentInitialIndex) {
	if (!nextNode || nextNode.type !== 'comment') {
		return comments;
	}

	if (!nextNode.raws.before || nextNode.raws.before.indexOf('\n') >= 0) {
		return comments;
	}

	currentInitialIndex = currentInitialIndex || node.initialIndex;

	nextNode.position = node.position;
	nextNode.initialIndex = currentInitialIndex + 0.0001;

	return getAllCommentsAfterNode(comments.concat(nextNode), nextNode.next(), node, nextNode.initialIndex);
}

function processLastComments(node, index, processedNodes) {
	if (node.type === 'comment' && !node.hasOwnProperty('position')) {
		node.position = Infinity;
		node.initialIndex = index;

		return processedNodes.concat(node);
	}

	return processedNodes;
}

function isRuleWithNodes(node) {
	return (node.type === 'rule' || node.type === 'atrule') && node.nodes && node.nodes.length;
}
