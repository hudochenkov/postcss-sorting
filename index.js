var postcss = require('postcss');
var path = require('path');
var fs = require('fs');

function getSortOrder(options) {
    // If no options use default config
    if (options === null || typeof options !== 'object' || !options['sort-order']) {
        options = { 'sort-order': 'default' };
    }

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

    if (typeof sortOrder[0] === 'string') {
        sortOrder.forEach(function (prop, propIndex) {
            order[prop] = {
                group: 0,
                prop: propIndex
            };
        });
    } else {
        sortOrder.forEach(function (group, groupIndex) {
            group.forEach(function (prop, propIndex) {
                order[prop] = {
                    group: groupIndex,
                    prop: propIndex
                };
            });
        });
    }

    return order;
}

// Replace multiple line breaks with one
function cleanLineBreaks(node) {
    if (node.raws.before) {
        node.raws.before = node.raws.before.replace(/\r\n\s*\r\n/g, '\r\n').replace(/\n\s*\n/g, '\n');
    }

    return node;
}

module.exports = postcss.plugin('postcss-sorting', function (opts) {
    return function (css) {
        var order = getSortOrder(opts);

        // Index to place the nodes that shouldn't be sorted
        var lastGroupIndex = order['...'] ? order['...'].group : Infinity;
        var lastPropertyIndex = order['...'] ? order['...'].prop : Infinity;

        css.walk(function (rule) {
            // Process only rules and atrules with nodes
            if ((rule.type === 'rule' || rule.type === 'atrule') && rule.nodes && rule.nodes.length) {

                // Nodes for sorting
                var processed = [];

                rule.each(function (node, index) {
                    var sortName = null;

                    if (node.type === 'comment') {
                        return;
                    } else if (node.type === 'decl') {
                        sortName = node.prop;

                        // If property start with $ and letters it's a variable
                        if (/^\$[\w-]+/.test(node.prop)) {
                            sortName = '$variable';
                        }
                    } else if (node.type === 'atrule') {
                        sortName = '@atrule';

                        // If atrule with name is in order use the name
                        var atruleName = '@' + node.name;

                        if (order[atruleName]) {
                            sortName = atruleName;
                        }

                        // Ff atRule has a parameter like @mixin name or @include name, sort by this parameter
                        var atruleParameter = /^[\w-]+/.exec(node.params);

                        if (atruleParameter && atruleParameter.length) {
                            var sortNameExtended = atruleName + ' ' + atruleParameter[0];

                            if (order[sortNameExtended]) {
                                sortName = sortNameExtended;
                            }
                        }
                    } else if (node.type === 'rule') {
                        sortName = '>child';
                    }

                    // Trying to get property indexes from order's list
                    var orderProperty = order[sortName];

                    // If no property in the list and this property is prefixed then trying to get parameters for unprefixed property
                    if (!orderProperty && postcss.vendor.prefix(sortName)) {
                        sortName = postcss.vendor.unprefixed(sortName);
                        orderProperty = order[sortName];
                    }

                    // If the declaration's property is in order's list, save its
                    // group and property indexes. Otherwise set them to 10000, so
                    // declaration appears at the bottom of a sorted list:
                    node.groupIndex = orderProperty && orderProperty.group > -1 ? orderProperty.group : lastGroupIndex;
                    node.propertyIndex = orderProperty && orderProperty.prop > -1 ? orderProperty.prop : lastPropertyIndex;
                    node.initialIndex = index;

                    // If comment on separate line before node, use node's indexes for comment
                    var commentsBefore = [];
                    var previousNode = node.prev();

                    while (previousNode && previousNode.type === 'comment') {
                        if (previousNode.raws.before && previousNode.raws.before.indexOf('\n') > -1) {
                            previousNode.groupIndex = node.groupIndex;
                            previousNode.propertyIndex = node.propertyIndex;
                            previousNode.initialIndex = index - 1;

                            var previousNodeClone = cleanLineBreaks(previousNode);

                            commentsBefore.unshift(previousNodeClone);

                            previousNode = previousNode.prev();
                        } else {
                            break;
                        }
                    }

                    if (commentsBefore.length) {
                        processed = processed.concat(commentsBefore);
                    }

                    // Add node itself
                    processed.push(node);

                    // If comment on same line with the node and node, use node's indexes for comment
                    var nextNode = node.next();

                    while (nextNode && nextNode.type === 'comment') {
                        if (nextNode.raws.before && nextNode.raws.before.indexOf('\n') < 0) {
                            nextNode.groupIndex = node.groupIndex;
                            nextNode.propertyIndex = node.propertyIndex;
                            nextNode.initialIndex = index + 1;

                            processed.push(nextNode);
                            nextNode = nextNode.next();
                        } else {
                            break;
                        }
                    }
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

                rule.removeAll();
                rule.append(processed);

                // Remove all empty lines and add empty lines between groups
                rule.each(function (node) {
                    node = cleanLineBreaks(node);

                    var prevNode = node.prev();

                    if (prevNode && node.groupIndex > prevNode.groupIndex) {
                        if (node.raws.before) {
                            node.raws.before = '\n' + node.raws.before;
                        }
                    }
                });

            }
        });
    };
});
