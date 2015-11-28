/**
 * Created by gpapp on 2015.05.15..
 */

angular.module('MindWebUi.node.service', [])
    .factory("NodeService", ["$rootScope", function ($rootScope) {
            const IconRegExp = /^Icon:\s*(.*)/;
            var defaultIconConfig = {project: 'list', task: 'yes', nextaction: 'bookmark', done: 'button_ok'};
            var iconConfig = {project: 'list', task: 'yes', nextaction: 'bookmark', done: 'button_ok'};

            function _loadConfig(rootNode) {
                _walknodes(rootNode, function (node) {
                        if (IconRegExp.test(node.nodeMarkdown)) {
                            if (!node.icon) {
                                $rootScope.$emit("$applicationError", "Icon not specified for node:" + node.nodeMarkdown);
                            } else {
                                _setConfigIcon(node.nodeMarkdown.replace(IconRegExp, '$1').toLowerCase(), node.icon[0].$['BUILTIN']);
                            }
                        }
                        return false;
                    }
                );
            }

            function _setConfigIcon(name, value) {
                var retval = false;
                if (iconConfig[name.toLowerCase()]) {
                    for (var i in iconConfig) {
                        if (!iconConfig.hasOwnProperty(i) || i===name) continue;
                        if (iconConfig[i] === value) {
                            $rootScope.$emit('$applicationError', 'Trying to reuse icon for ' + name);
                            return false;
                        }
                    }
                    retval = true;
                }
                iconConfig[name.toLowerCase()] = value;
                return retval;
            }

            function _configToIcon(configKey) {
                if (iconConfig.hasOwnProperty(configKey.toLowerCase())) {
                    return iconConfig[configKey.toLowerCase()];
                }
                return null;
            }

            function _hasConfigIcon(node, configName) {
                if (!node) return false;
                if (!node.icon) return false;
                var toSearch = _configToIcon(configName);
                if (!toSearch) {
                    return false;
                }
                for (var i = 0; i < node.icon.length; i++) {
                    if (node.icon[i].$['BUILTIN'] === toSearch) {
                        return true;
                    }
                }
                return false;
            }

            function _addConfigIcon(editScope, node, icon) {
                if (!node) return;
                var toSearch = _configToIcon(icon);
                if (!toSearch) {
                    return;
                }
                if (!node.icon) {
                    node.icon = [];
                }
                for (var i = 0; i < node.icon.length; i++) {
                    if (node.icon[i].$['BUILTIN'] === toSearch) {
                        return;
                    }
                }
                node.icon.unshift({'$': {BUILTIN: toSearch}});
                editScope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
            }

            function _removeConfigIcon(editScope, node, icon) {
                if (!node) return;
                if (!node.icon) return;
                var toSearch = iconConfig[icon];
                if (!toSearch) {
                    return;
                }
                for (var i = 0; i < node.icon.length; i++) {
                    if (node.icon[i].$['BUILTIN'].toLowerCase() === toSearch.toLowerCase()) {
                        node.icon.splice(i, 1);
                    }
                }
                if (node.icon.length == 0) {
                    delete node.icon;
                }
                editScope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
            }

            function findIconForConfig(rootNode, configKey) {
                var newIcon = null;
                _walknodes(rootNode, function (innerNode) {
                    var parseResult = IconRegExp.exec(innerNode.nodeMarkdown);
                    if (!parseResult) {
                        return false;
                    }
                    var newConfig = parseResult[1].toLowerCase();
                    if (configKey === newConfig && innerNode.icon) {
                        newIcon = innerNode.icon[0].$['BUILTIN'];
                    }
                    // Parse the entire tree, don't stop on the first hit
                    return false;
                });
                if (!newIcon && defaultIconConfig[configKey]) {
                    newIcon = defaultIconConfig[configKey];
                }
                return newIcon;
            }

            function _nodeDeleteHook(editScope, rootNode, deletednode) {
                _walknodes(deletednode, function (node) {
                    var parseResult = IconRegExp.exec(node.nodeMarkdown);
                    if (!parseResult) {
                        return false;
                    }
                    var config = parseResult[1].toLowerCase();
                    delete iconConfig[config];
                    var newIcon = findIconForConfig(rootNode, config);
                    var oldIcon = node.icon[0].$['BUILTIN'];
                    if (newIcon && oldIcon != newIcon) {
                        iconConfig[config] = newIcon;
                        _replaceIcon(editScope, rootNode, oldIcon, newIcon);
                    }
                    return false;
                });
            }

            function _nodeChangeHook(editScope, rootNode, node, oldValue) {
                // If the old value has changed, remove the old config
                if (oldValue && IconRegExp.test(oldValue)) {
                    var oldConfigKey = IconRegExp.exec(oldValue)[1].toLowerCase();
                    var oldConfigIcon = _configToIcon(oldConfigKey);
                    delete iconConfig[oldConfigKey];
                    var newIcon = findIconForConfig(rootNode, oldConfigKey);
                    if (newIcon && oldConfigIcon != newIcon) {
                        iconConfig[oldConfigKey] = newIcon;
                        _replaceIcon(editScope, rootNode, oldIcon, newIcon);
                    }
                }
                if (IconRegExp.test(node.nodeMarkdown)) {
                    var configKey = IconRegExp.exec(node.nodeMarkdown)[1].toLowerCase();
                    var configIcon = _configToIcon(configKey);
                    var newIcon = configIcon;
                    if (node.icon) {
                        newIcon = node.icon[0].$['BUILTIN'];
                    } else {
                        newIcon = findIconForConfig(rootNode, configKey);
                    }
                    if (configIcon != newIcon) {
                        if (_setConfigIcon(configKey, newIcon)) {
                            _replaceIcon(editScope, rootNode, configIcon, newIcon);
                        } else {
                            _addConfigIcon(editScope, node, configKey);
                        }
                    }
                }
            }

            function _getAttribute(node, name, defaultValue) {
                if (!node) return defaultValue;
                if (!node.attribute) return defaultValue;
                for (var i = 0; i < node.attribute.length; i++) {
                    if (node.attribute[i].$['NAME'] === name) {
                        return node.attribute[i].$['VALUE'];
                    }
                }
                return defaultValue;
            }

            function _setAttribute(editScope, node, name, value) {
                if (!node) return;
                if (!node.attribute) {
                    node.attribute = [];
                }
                var done = false;
                for (var i = 0; i < node.attribute.length; i++) {
                    if (node.attribute[i].$['NAME'] === name) {
                        node.attribute[i].$['VALUE'] = value;
                        done = true;
                    }
                }
                if (!done) {

                    node.attribute.push({$: {"NAME": name, "VALUE": value}});
                }
                editScope.$emit('fileModified', {
                    event: 'nodeSetAttribute',
                    parent: node.$['ID'],
                    payload: {name: name, value: value}
                });
            }

            function _walknodes(node, fn) {
                var ptr;
                var index;
                var visited = [[node, 0]];
                while (visited.length > 0) {
                    var pos = visited.pop();
                    ptr = pos[0];
                    index = pos[1];
                    if (!ptr.node) {
                        if (fn(ptr)) return;
                    } else if (index < ptr.node.length) {
                        if (fn(ptr)) return;
                        visited.push([ptr, index + 1]);
                        visited.push([ptr.node[index], 0]);
                    } else {

                    }
                }
            }

            function _findNodeById(startNode, idStr) {
                var foundNode = null;
                _walknodes(startNode, function (node) {
                    if (node.$['ID'] === idStr) {
                        foundNode = node;
                        return true;
                    }
                    return false;
                });
                return foundNode;
            }

            function _replaceIcon(editScope, node, oldIcon, newIcon) {
                _walknodes(node, function (node) {
                    if (node.icon && !IconRegExp.test(node.nodeMarkdown)) {
                        var changed = false;
                        for (var i = 0; i < node.icon.length; i++) {
                            if (node.icon[i].$['BUILTIN'] === oldIcon) {
                                changed = true;
                                node.icon[i].$['BUILTIN'] = newIcon;
                            }
                        }
                        if (changed) {
                            editScope.$emit('fileModified', {
                                event: 'nodeModifyIcons',
                                parent: node.$['ID'],
                                payload: node.icon
                            });
                        }
                    }
                    return false;
                });
            }

            return {
                loadConfig: _loadConfig,
                addConfigIcon: _addConfigIcon,
                configToIcon: _configToIcon,
                setConfigIcon: _setConfigIcon,
                hasConfigIcon: _hasConfigIcon,
                removeConfigIcon: _removeConfigIcon,

                nodeDeleteHook: _nodeDeleteHook,
                nodeChangeHook: _nodeChangeHook,

                getAttribute: _getAttribute,
                setAttribute: _setAttribute,
                walknodes: _walknodes,
                findNodeById: _findNodeById,
                replaceIcon: _replaceIcon
            }
                ;
        }
        ]
    );