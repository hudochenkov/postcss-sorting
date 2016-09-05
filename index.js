var postcss = require('postcss');
var objectAssign = require('object-assign');
var path = require('path');
var fs = require('fs');

module.exports = postcss.plugin('postcss-sorting', function (opts) {
	return function (css) {
		plugin(css, opts);
	};
});

function plugin(css, opts) {
	// Verify options and use defaults if not specified
	opts = verifyOptions(opts);

	var enableSorting = true;

	css.walk(function (node) {
		if (node.type === 'comment' && node.parent.type === 'root') {
			if (node.text === 'postcss-sorting: on') {
				enableSorting = true;
			} else if (node.text === 'postcss-sorting: off') {
				enableSorting = false;
			}
		}

		if (!enableSorting) {
			return;
		}

		// Process only rules and atrules with nodes
		if ((node.type === 'rule' || node.type === 'atrule') && node.nodes && node.nodes.length) {
			// Nodes for sorting
			var processed = [];

			// Add indexes to nodes
			node.each(function (childNode, index) {
				processed = processMostNodes(childNode, index, opts, processed);
			});

			// Add last comments in the rule. Need this because last comments are not belonging to anything
			node.each(function (childNode, index) {
				processed = processLastComments(childNode, index, processed);
			});

			// Sort declarations saved for sorting
			processed.sort(sortByIndexes);

			// Replace rule content with sorted one
			if (processed.length) {
				node.removeAll();
				node.append(processed);
			}

			// Taking care of empty lines
			node.each(function (childNode) {
				formatNodes(childNode, opts);
			});
		}
	});
}

function verifyOptions(options) {
	if (options === null || typeof options !== 'object') {
		options = {};
	}

	var defaultOptions = {
		'sort-order': 'default',
		'empty-lines-between-children-rules': 0,
		'empty-lines-between-media-rules': 0,
		'preserve-empty-lines-between-children-rules': false,
		'empty-lines-before-comment': 0,
		'empty-lines-after-comment': 0,
	};

	return objectAssign({}, defaultOptions, options);
}

function getSortOrderFromOptions(options) {
	var sortOrder;

	if (Array.isArray(options['sort-order'])) {
		sortOrder = options['sort-order'];
	} else if (typeof options['sort-order'] === 'string') {
		var configPath = path.join(__dirname, './configs/', options['sort-order']) + '.json';

		try {
			sortOrder = fs.readFileSync(configPath);
			sortOrder = JSON.parse(sortOrder);
			sortOrder = sortOrder['sort-order'];
		} catch (error) {
			return {};
		}
	} else {
		return {};
	}

	// Add sorting indexes to order
	var order = {};

	(typeof sortOrder[0] === 'string' ? [sortOrder] : sortOrder)
		.forEach(function (group, groupIndex) {
			group.forEach(function (prop, propIndex) {
				order[prop] = {
					group: groupIndex,
					prop: propIndex
				};
			});
		});

	return order;
}

function getLinesBetweenRulesFromOptions(name, options) {
	var lines = options['empty-lines-between-' + name + '-rules'];

	if (typeof lines !== 'number' || isNaN(lines) || !isFinite(lines) || lines < 0 || Math.floor(lines) !== lines) {
		throw new Error('Type of "empty-lines-between-' + name + '-rules" option must be integer with positive value.');
	}

	return lines;
}

// Replace multiple line breaks with one
function cleanLineBreaks(node) {
	if (node.raws.before) {
		node.raws.before = node.raws.before.replace(/\r\n\s*\r\n/g, '\r\n').replace(/\n\s*\n/g, '\n');
	}

	return node;
}

function createLineBreaks(lineBreaksCount) {
	return new Array(lineBreaksCount + 1).join('\n');
}

function getAtruleSortName(node, order) {
	var atruleName = '@' + node.name;
	var sortNameExtended;
	var atruleParameter;

	// If atRule has a parameter like `@mixin name` or `@include name`, sort by this parameter
	if (node.params) {
		atruleParameter = node.params;
		sortNameExtended = atruleName + ' ' + atruleParameter;

		// check if there is a whole parameter in the config, e. g. `media("<=desk")`
		if (order[sortNameExtended]) {
			return sortNameExtended;
		}

		// check if there is a part of parameter in the config, e. g. `media` from `media("<=desk")`
		atruleParameter = (/^[\w-]+/).exec(atruleParameter);

		if (atruleParameter && atruleParameter.length) {
			sortNameExtended = atruleName + ' ' + atruleParameter[0];

			if (order[sortNameExtended]) {
				return sortNameExtended;
			}
		}
	}

	// If atrule with name is in order use the name
	if (order[atruleName]) {
		return atruleName;
	}

	return '@atrule';
}

function getSortName(node, order) {
	switch (node.type) {
		case 'decl':
			return (/^(\$|--)[\w-]+/).test(node.prop) ? '$variable' : node.prop;

		case 'atrule':
			return getAtruleSortName(node, order);

		case 'rule':
			return '>child';

		default:
			return null;
	}
}

function getOrderProperty(node, order) {
	var sortName = getSortName(node, order);

	// Trying to get property indexes from order's list
	var orderProperty = order[sortName];

	// If no property in the list and this property is prefixed then trying to get parameters for unprefixed property
	if (!orderProperty && postcss.vendor.prefix(sortName)) {
		sortName = postcss.vendor.unprefixed(sortName);
		orderProperty = order[sortName];
	}

	return orderProperty;
}

function addIndexesToNode(node, index, order) {
	// Index to place the nodes that shouldn't be sorted
	var lastGroupIndex = order['...'] ? order['...'].group : Infinity;
	var lastPropertyIndex = order['...'] ? order['...'].prop : Infinity;

	var orderProperty = getOrderProperty(node, order);

	// If the declaration's property is in order's list, save its
	// group and property indexes. Otherwise set them to 10000, so
	// declaration appears at the bottom of a sorted list:
	node.groupIndex = orderProperty && orderProperty.group > -1 ? orderProperty.group : lastGroupIndex;
	node.propertyIndex = orderProperty && orderProperty.prop > -1 ? orderProperty.prop : lastPropertyIndex;
	node.initialIndex = index;

	return node;
}

function fetchAllCommentsBeforeNode(comments, previousNode, node, currentInitialIndex) {
	if (!previousNode || previousNode.type !== 'comment') {
		return comments;
	}

	if (!previousNode.raws.before || previousNode.raws.before.indexOf('\n') === -1) {
		return comments;
	}

	currentInitialIndex = currentInitialIndex || node.initialIndex;

	previousNode.groupIndex = node.groupIndex;
	previousNode.propertyIndex = node.propertyIndex;
	previousNode.initialIndex = currentInitialIndex - 0.0001;

	var newComments = [previousNode].concat(comments);

	return fetchAllCommentsBeforeNode(newComments, previousNode.prev(), node, previousNode.initialIndex);
}

function fetchAllCommentsAfterNode(comments, nextNode, node, currentInitialIndex) {
	if (!nextNode || nextNode.type !== 'comment') {
		return comments;
	}

	if (!nextNode.raws.before || nextNode.raws.before.indexOf('\n') >= 0) {
		return comments;
	}

	currentInitialIndex = currentInitialIndex || node.initialIndex;

	nextNode.groupIndex = node.groupIndex;
	nextNode.propertyIndex = node.propertyIndex;
	nextNode.initialIndex = currentInitialIndex + 0.0001;

	return fetchAllCommentsAfterNode(comments.concat(nextNode), nextNode.next(), node, nextNode.initialIndex);
}

function getApplicableNode(lookFor, node) {
	// find if there any rules before, and skip the comments
	var prevNode = node.prev();

	if (prevNode) {
		if (prevNode.type === lookFor) {
			return node;
		}

		if (prevNode.type === 'comment') {
			return getApplicableNode(lookFor, prevNode);
		}
	}

	return false;
}

function countEmptyLines(str) {
	var lineBreaks = (str.match(/\n/g) || []).length;

	if (lineBreaks > 0) {
		lineBreaks -= 1;
	}

	return lineBreaks;
}

function processMostNodes(node, index, opts, processedNodes) {
	if (node.type === 'comment') {
		if (index === 0 && node.raws.before.indexOf('\n') === -1) {
			node.ruleComment = true; // need this flag to not append this comment twice

			return processedNodes.concat(node);
		}

		return processedNodes;
	}

	var order = getSortOrderFromOptions(opts);

	node = addIndexesToNode(node, index, order);

	// If comment on separate line before node, use node's indexes for comment
	var commentsBefore = fetchAllCommentsBeforeNode([], node.prev(), node);

	// If comment on same line with the node and node, use node's indexes for comment
	var commentsAfter = fetchAllCommentsAfterNode([], node.next(), node);

	return processedNodes.concat(commentsBefore, node, commentsAfter);
}

function processLastComments(node, index, processedNodes) {
	if (node.type === 'comment' && !node.hasOwnProperty('groupIndex') && !node.ruleComment) {
		node.groupIndex = Infinity;
		node.propertyIndex = Infinity;
		node.initialIndex = index;

		return processedNodes.concat(node);
	}

	return processedNodes;
}

function sortByIndexes(a, b) {
	// If a's group index is higher than b's group index, in a sorted
	// list a appears after b:
	if (a.groupIndex !== b.groupIndex) {
		return a.groupIndex - b.groupIndex;
	}

	// If a and b have the same group index, and a's property index is
	// higher than b's property index, in a sorted list a appears after
	// b:
	if (a.propertyIndex !== b.propertyIndex) {
		return a.propertyIndex - b.propertyIndex;
	}

	// If a and b have the same group index and the same property index,
	// in a sorted list they appear in the same order they were in
	// original array:
	return a.initialIndex - b.initialIndex;
}

function formatNodes(node, opts) {
	var linesBetweenChildrenRules = getLinesBetweenRulesFromOptions('children', opts);
	var linesBetweenMediaRules = getLinesBetweenRulesFromOptions('media', opts);
	var preserveLinesBetweenChildren = opts['preserve-empty-lines-between-children-rules'];
	var linesBeforeComment = opts['empty-lines-before-comment'];
	var linesAfterComment = opts['empty-lines-after-comment'];

	// don't remove empty lines if they are should be preserved
	if (
		!(
			preserveLinesBetweenChildren &&
			(node.type === 'rule' || node.type === 'comment') &&
			node.prev() &&
			getApplicableNode('rule', node)
		)
	) {
		node = cleanLineBreaks(node);
	}

	var prevNode = node.prev();

	if (prevNode && node.raws.before) {
		if (node.groupIndex > prevNode.groupIndex) {
			node.raws.before = createLineBreaks(1) + node.raws.before;
		}

		var applicableNode;

		// Insert empty lines between children classes
		if (node.type === 'rule' && linesBetweenChildrenRules > 0) {
			// between rules can be comments, so empty lines should be added to first comment between rules, rather than to rule
			applicableNode = getApplicableNode('rule', node);

			if (applicableNode) {
				// add lines only if source empty lines not preserved, or if there are less empty lines then should be
				if (
					!preserveLinesBetweenChildren ||
					(
						preserveLinesBetweenChildren &&
						countEmptyLines(applicableNode.raws.before) < linesBetweenChildrenRules
					)
				) {
					applicableNode.raws.before = createLineBreaks(linesBetweenChildrenRules - countEmptyLines(applicableNode.raws.before)) + applicableNode.raws.before;
				}
			}
		}

		// Insert empty lines between media rules
		if (node.type === 'atrule' && node.name === 'media' && linesBetweenMediaRules > 0) {
			// between rules can be comments, so empty lines should be added to first comment between rules, rather than to rule
			applicableNode = getApplicableNode('atrule', node);

			if (applicableNode) {
				applicableNode.raws.before = createLineBreaks(linesBetweenMediaRules - countEmptyLines(applicableNode.raws.before)) + applicableNode.raws.before;
			}
		}

		// Insert empty lines before comment
		if (
			linesBeforeComment &&
			node.type === 'comment' &&
			(prevNode.type !== 'comment' || prevNode.raws.before.indexOf('\n') === -1) && // prevNode it's not a comment or it's an inline comment
			node.raws.before.indexOf('\n') >= 0 && // this isn't an inline comment
			countEmptyLines(node.raws.before) < linesBeforeComment
		) {
			node.raws.before = createLineBreaks(linesBeforeComment - countEmptyLines(node.raws.before)) + node.raws.before;
		}

		// Insert empty lines after comment
		if (
			linesAfterComment &&
			node.type !== 'comment' &&
			prevNode.type === 'comment' &&
			prevNode.raws.before.indexOf('\n') >= 0 && // this isn't an inline comment
			countEmptyLines(node.raws.before) < linesAfterComment
		) {
			node.raws.before = createLineBreaks(linesAfterComment - countEmptyLines(node.raws.before)) + node.raws.before;
		}
	}
}
