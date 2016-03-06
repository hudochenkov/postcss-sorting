var postcss = require('postcss');
var path = require('path');
var fs = require('fs');

function verifyOptions(options) {
    if (options === null || typeof options !== 'object') {
        options = {};
    }

    options['sort-order'] = options['sort-order'] || 'default';
    options['empty-lines-between-children-rules'] = options['empty-lines-between-children-rules'] || 0;

    return options;
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

function getLinesBetweenChildrenFromOptions(options) {
    var lines = options['empty-lines-between-children-rules'];

    if (typeof lines !== 'number' || isNaN(lines) || !isFinite(lines) || lines < 0 || Math.floor(lines) !== lines) {
        throw new Error('Type of "empty-lines-between-children-rules" option must be integer with positive value.');
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

    // If atRule has a parameter like @mixin name or @include name, sort by this parameter
    var atruleParameter = /^[\w-]+/.exec(node.params);

    if (atruleParameter && atruleParameter.length) {
        var sortNameExtended = atruleName + ' ' + atruleParameter[0];

        if (order[sortNameExtended]) {
            return sortNameExtended;
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
        return /^\$[\w-]+/.test(node.prop) ? '$variable' : node.prop;

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

    var previousNodeClone = cleanLineBreaks(previousNode);
    var newComments = [previousNodeClone].concat(comments);

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

module.exports = postcss.plugin('postcss-sorting', function (opts) {
    // Verify options and use defaults if not specified
    opts = verifyOptions(opts);

    return function (css) {
        var order = getSortOrderFromOptions(opts);
        var linesBetweenChildrenRules = getLinesBetweenChildrenFromOptions(opts);

        // Index to place the nodes that shouldn't be sorted
        var lastGroupIndex = order['...'] ? order['...'].group : Infinity;
        var lastPropertyIndex = order['...'] ? order['...'].prop : Infinity;

        css.walk(function (rule) {
            // Process only rules and atrules with nodes
            if ((rule.type === 'rule' || rule.type === 'atrule') && rule.nodes && rule.nodes.length) {

                // Nodes for sorting
                var processed = [];

                rule.each(function (node, index) {
                    if (node.type === 'comment') {
                        if (index === 0 && node.raws.before.indexOf('\n') === -1) {
                            processed.push(node);
                        }

                        return;
                    }

                    var orderProperty = getOrderProperty(node, order);

                    // If the declaration's property is in order's list, save its
                    // group and property indexes. Otherwise set them to 10000, so
                    // declaration appears at the bottom of a sorted list:
                    node.groupIndex = orderProperty && orderProperty.group > -1 ? orderProperty.group : lastGroupIndex;
                    node.propertyIndex = orderProperty && orderProperty.prop > -1 ? orderProperty.prop : lastPropertyIndex;
                    node.initialIndex = index;

                    // If comment on separate line before node, use node's indexes for comment
                    var commentsBefore = fetchAllCommentsBeforeNode([], node.prev(), node);

                    // If comment on same line with the node and node, use node's indexes for comment
                    var commentsAfter = fetchAllCommentsAfterNode([], node.next(), node);

                    processed = processed.concat(commentsBefore, node, commentsAfter);
                });

                // Sort declarations saved for sorting:
                processed.sort(function (a, b) {
                    // If a's group index is higher than b's group index, in a sorted
                    // list a appears after b:
                    if (a.groupIndex !== b.groupIndex) return a.groupIndex - b.groupIndex;

                    // If a and b have the same group index, and a's property index is
                    // higher than b's property index, in a sorted list a appears after
                    // b:
                    if (a.propertyIndex !== b.propertyIndex) return a.propertyIndex - b.propertyIndex;

                    // If a and b have the same group index and the same property index,
                    // in a sorted list they appear in the same order they were in
                    // original array:
                    return a.initialIndex - b.initialIndex;
                });

                if (processed.length) {
                    rule.removeAll();
                    rule.append(processed);
                }

                // Remove all empty lines and add empty lines between groups
                rule.each(function (node) {
                    node = cleanLineBreaks(node);

                    var prevNode = node.prev();

                    if (prevNode && node.raws.before) {
                        if (node.groupIndex > prevNode.groupIndex) {
                            node.raws.before = createLineBreaks(1) + node.raws.before;
                        }

                        // Insert empty lines between children classes
                        if (node.type === 'rule' && prevNode.type === 'rule' && linesBetweenChildrenRules > 0) {
                            node.raws.before = createLineBreaks(linesBetweenChildrenRules) + node.raws.before;
                        }
                    }
                });
            }
        });
    };
});
