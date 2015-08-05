angular.module('MindWebUi.viewer', [
    'MindWebUi.file.service',
    'ui.router',
    'angular-markdown',
    'ui.bootstrap.tabs',
    'ui.tree',
    'angular-keyboard'
])
    .filter('escape', function () {
        return window.encodeURIComponent;
    })
    .config(['$stateProvider',
        function ($stateProvider, $rootScope) {
            $stateProvider
                .state('viewer', {
                    abstract: true,
                    url: '/viewer',
                    templateUrl: '/app/viewer/viewerTemplate.html',
                    controller: 'viewerController',
                    data: {
                        requireLogin: false
                    }
                })
                .state('viewer.file', {
                    url: '/{fileId:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}',
                    views: {
                        '': {
                            templateUrl: 'app/viewer/file.html',
                            controller: 'structureController'
                        },
                        'detail@viewer': {
                            templateUrl: 'app/viewer/detail.html',
                            controller: 'detailController'
                        }
                    }
                });
        }
    ])
    .controller('viewerController', function ($scope, $location, $anchorScroll, $interval, FileApi) {
        var msgStack = [];
        var saveTimer = $interval(function () {
            $scope.performSave();
        }, 10000);

        $anchorScroll.yOffset = 50;
        $scope.$on('openId', function (event, data) {
            $scope.openId = data.id;
            event.stopPropagation();
        });
        $scope.$on('selectNode', function (event, data) {
            $scope.currentNode = data.node;
            $scope.currentEditor = {
                text: data.node.nodeMarkdown,
                detail: data.node.detailMarkdown,
                note: data.node.noteMarkdown
            };
            $location.hash(data.node.$['ID']);
            event.stopPropagation();
        });
        $scope.$on('selectTab', function (event, data) {
            $scope.selectedTab = data.destination;
            event.stopPropagation();
        });
        $scope.$on('fileModified', function (event, data) {
            for (var i in msgStack) {
                if (msgStack[i].parent === data.parent && msgStack[i].event === data.event) {
                    msgStack.splice(i, 1);
                }
            }
            msgStack.push(data);
            $scope.msgStack = msgStack;
            event.stopPropagation();
        });
        $scope.$on("$destroy", function (event) {
                $interval.cancel(saveTimer);
                $scope.performSave();
            }
        );

        $scope.performSave = function () {
            var messages = msgStack;
            if (messages.length > 0) {
                FileApi.save($scope.openId, messages).then(function (data) {
                    msgStack = [];
                });
            }
        }
    })
    .controller('structureController', function ($scope, $rootScope, $state, $filter, $window, FileApi) {
        // Array of nodes, to be used for lookups.
        var flatNodes = [];

        $rootScope.$emit('$routeChangeStart');

        $rootScope.$on("closeFile", function (event, file) {
            if ($state.params.fileId === file.id) {
                $state.go('files.list');
            }
        });

        FileApi.load($state.params.fileId).then(function (data) {
            $scope.nodes = JSON.parse(data.content);
            $scope.nodes.map.open = true;
            $scope.$emit('openId', {id: $state.params.fileId});
            $scope.$emit('selectNode', {node: $scope.nodes.map});
            $rootScope.$emit('$routeChangeSuccess');
        });

        // create parent/child links, build flat array to store the nodes,
        // to overcome recursion depth limitations
        $scope.setupParent = function (node, $modelValue, $index) {
            flatNodes.push(node);
            node.$parent = $modelValue;
            node.$parentIndex = $index;
        };

        $scope.nodeToggleOpen = function (node) {
            node.open = !node.open;
            $scope.$emit('fileModified', {event: 'nodeFold', parent: node.$['ID'], payload: node.open});
        };
        $scope.detailToggleOpen = function (node) {
            node.detailOpen = !node.detailOpen;
            $scope.$emit('fileModified', {event: 'nodeDetailFold', parent: node.$['ID'], payload: node.detailOpen});
        };
        $scope.openDetails = function (node, destination) {
            $rootScope.Ui.turnOn('detailPanel');
            $scope.$emit('selectNode', {node: node});
            $scope.$emit('selectTab', {destination: destination});
        };

        $scope.jumptoLink = function (link) {
            if (link[0] == '#') {
                for (var nodeindex in flatNodes) {
                    var node = flatNodes[nodeindex];
                    if (node.$['ID'] === link.substr(1)) {
                        var nodeparent = node.$parent;
                        while (nodeparent.$parent) {
                            nodeparent.open = true;
                            nodeparent = nodeparent.$parent;
                        }
                        $scope.$emit('selectNode', {node: node});
                        break;
                    }
                }
            } else {
                $window.open(link, '_blank');
            }
        };
        $scope.selectNode = function (event) {
            var currentNode = $scope.currentNode;
            switch (event) {
                case 'prev':
                    if (!currentNode.$parent) {
                        break;
                    }
                    if (currentNode.$parentIndex == 0) {
                        // if it's the first node, select it's parent as next
                        $scope.$emit('selectNode', {node: currentNode.$parent});
                    } else {
                        // find the previous node, or it`s last open child
                        if (!currentNode.$parent.node[currentNode.$parentIndex - 1].open) {
                            $scope.$emit('selectNode', {node: currentNode.$parent.node[currentNode.$parentIndex - 1]});
                        } else {
                            //dig down to last open child
                            var ptr = currentNode.$parent.node[currentNode.$parentIndex - 1];
                            outside:
                                do {
                                    for (var i = ptr.node.length - 1; i >= 0; i++) {
                                        if (ptr.node[i].open) {
                                            ptr = ptr.node[i];
                                            break;
                                        } else {
                                            $scope.$emit('selectNode', {node: ptr.node[i]});
                                            break outside;
                                        }
                                    }
                                } while (true);
                        }
                    }
                    break;
                case 'next':
                    if (!currentNode.$parent && !currentNode.open) {
                        break;
                    }
                    if (currentNode.node && currentNode.open) {
                        $scope.$emit('selectNode', {node: currentNode.node[0]});
                    } else if (currentNode.$parentIndex < currentNode.$parent.node.length - 1) {
                        // if it's the last node, select it's parent's sibling as next
                        $scope.$emit('selectNode', {node: currentNode.$parent.node[currentNode.$parentIndex + 1]});
                    } else {
                        var ptr = currentNode.$parent;
                        do {
                            if (!ptr.$parent) {
                                break;
                            }
                            if (ptr.$parentIndex + 1 == ptr.$parent.node.length) {
                                ptr = ptr.$parent;
                                continue;
                            }
                            $scope.$emit('selectNode', {node: ptr.$parent.node[ptr.$parentIndex + 1]});
                            break;
                        } while (true);
                    }
                    break;
                case 'fold':
                    if (currentNode.node) {
                        currentNode.open = false;
                        $scope.$emit('fileModified', {
                            event: 'nodeFold',
                            parent: currentNode.$['ID'],
                            payload: currentNode.open
                        });
                    }
                    break;
                case 'unfold':
                    if (currentNode.node) {
                        currentNode.open = true;
                        $scope.$emit('fileModified', {
                            event: 'nodeFold',
                            parent: currentNode.$['ID'],
                            payload: currentNode.open
                        });
                    }
                    break;
            }
        };
        $scope.addNode = function (target) {
            var newNode = {};
            var timeStamp = new Date().getTime();
            if (target instanceof String) {
                newNode.$parent = target === 'current' ? $scope.currentNode : $scope.currentNode.$parent;
            } else {
                newNode.$parent = target;
            }

            newNode.$ = {CREATED: timeStamp, ID: 'ID_' + timeStamp, MODIFIED: timeStamp, TEXT: 'New Node'};
            newNode.nodeMarkdown = 'New Node';
            var minId = -1;
            for (var i = flatNodes.length - 1; i >= 0; i--) {
                var curNum = Number(flatNodes[i].$$hashKey.substr(7));
                if (curNum > minId) {
                    minId = curNum;
                }
            }
            newNode.$$hashKey = 'object:' + (minId + 1);
            if (newNode.$parent.node) {
                newNode.$parent.node.push(newNode);
            } else {
                newNode.$parent.node = [newNode];
            }
            newNode.$parentIndex = newNode.$parent.node.length - 1;

            flatNodes.push(newNode);
            // Make sure the node is open, so the new node is shown
            newNode.$parent.open = true;
            $scope.$emit('fileModified', {event: 'newNode', parent: newNode.$parent.$['ID'], payload: newNode});
        };
        $scope.deleteNode = function (target) {
            if (target instanceof String) {
                target = $scope.currentNode;
            }
            // TODO: Do a deep tree traversal to remove the nodes under it
            var ptr = target;
            while (true) {
                if (ptr === target && !ptr.node) break;
                if (ptr.node && ptr.node.length > 0) {
                    ptr = ptr.node[0];
                } else {
                    for (var i in flatNodes) {
                        if (ptr === flatNodes[i]) {
                            flatNodes.splice(i, 1);
                            break;
                        }
                    }
                    ptr = ptr.$parent;
                    ptr.node.splice(0, 1);
                    if (ptr.node.length == 0) {
                        delete ptr.node;
                    }

                }
            }
            for (var i in flatNodes) {
                if (target === flatNodes[i]) {
                    flatNodes.splice(i, 1);
                    break;
                }
            }
            var parent = target.$parent;
            parent.node.splice(target.$parentIndex, 1);
            for (var i  in parent.node) {
                parent.node[i].$parentIndex = i;
            }
            if (parent.node.length == 0) {
                delete parent.node;
            }
            $scope.$emit('fileModified', {event: 'deleteNode', parent: target.$['ID']});
        }
    })
    .controller('detailController', function ($scope, $http) {

        $http.get('app/viewer/iconlist.json')
            .then(function (res) {
                $scope.iconList = res.data;
            });

        $scope.$watch('currentEditor.text', function (newValue, oldValue) {
            if ($scope.currentNode.nodeMarkdown != newValue) {
                $scope.currentNode.nodeMarkdown = newValue;
                $scope.$emit('fileModified', {
                    event: 'nodeText',
                    parent: $scope.currentNode.$['ID'],
                    payload: newValue
                });
            }
        });

        $scope.$watch('currentEditor.detail', function (newValue, oldValue) {
            if ($scope.currentNode.detailMarkdown != newValue) {
                $scope.currentNode.detailMarkdown = newValue;
                $scope.$emit('fileModified', {
                    event: 'nodeDetail',
                    parent: $scope.currentNode.$['ID'],
                    payload: newValue
                });
            }
        });

        $scope.$watch('currentEditor.note', function (newValue, oldValue) {
            if ($scope.currentNode.noteMarkdown != newValue) {
                $scope.currentNode.noteMarkdown = newValue;
                $scope.$emit('fileModified', {
                    event: 'nodeNote',
                    parent: $scope.currentNode.$['ID'],
                    payload: newValue
                });
            }
        });

        $scope.moveIcon = function (pos, dir) {
            var node = $scope.currentNode;
            var icons = node.icon;
            var cut = icons[pos];
            var target;
            switch (dir) {
                case 'left':
                    target = pos - 1;
                    break;
                case 'right':
                    target = pos + 1;
                    break;
            }
            icons[pos] = icons[target];
            icons[target] = cut;
            $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: icons});
        };

        $scope.deleteIcon = function (pos) {
            var node = $scope.currentNode;
            node.icon.splice(pos, 1);
            if (node.icon.length == 0) {
                delete node.icon;
            }
            $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
        };

        $scope.addIcon = function (name) {
            var node = $scope.currentNode;
            if (node.icon) {
                node.icon.push({'$': {BUILTIN: name}});
            } else {
                node.icon = [{'$': {BUILTIN: name}}];
            }
            $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
        };

        $scope.selectTab = function (destination) {
            $scope.$emit('selectTab', {destination: destination});
        };
    });
