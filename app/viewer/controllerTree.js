angular.module('MindWebUi.viewer.treeController', [
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree',
        'angular-markdown',
        'angular-keyboard',
        'MindWebUi.public.service',
        'MindWebUi.file.service',
        'MindWebUi.task.service',
    ])
    .controller('viewerTreeController', function ($scope, $rootScope, $state, $filter, $timeout, $window, PublicService, TaskService) {
        // Array of nodes, to be used for lookups.
        var flatNodes = [];

        $scope.loading = true;

        $rootScope.$on("closeFile", function (event, file) {
            if ($state.params.fileId === file.id) {
                $state.go('files.list');
            }
        });

        PublicService.load($state.params.fileId).then(function (data) {
            $scope.file = data.file;
            $scope.nodes = data.content;
            $scope.nodes.rootNode.open = true;
            $scope.nodes.rootNode.$$hashKey = 'object:0';
            $scope.loading = false;
            $scope.$emit('openId', {id: $state.params.fileId});
            $scope.$emit('selectNode', {node: $scope.nodes.rootNode});
        });

        // create parent/child links, build flat array to store the nodes,
        // to overcome recursion depth limitations
        $scope.setupParent = function (parent, $modelValue, $index) {
            if (!$modelValue)return;
            flatNodes.push($modelValue);
            $modelValue.$parent = parent;
            $modelValue.$parentIndex = $index;
        };

        $scope.longPressNode = function (node) {
            $scope.$emit('selectNode', {node: node});
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
            if (typeof target === 'string') {
                newNode.$parent = target === 'current' ? $scope.currentNode : $scope.currentNode.$parent;
                if (!newNode.$parent) {
                    newNode.$parent = $scope.currentNode;
                }
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
            $scope.$emit('selectNode', {node: newNode});
            $scope.$emit('fileModified', {event: 'newNode', parent: newNode.$parent.$['ID'], payload: newNode});
        };

        $scope.deleteNode = function (target) {
            if (typeof target === 'string') {
                target = $scope.currentNode;
                if (!target.$parent) {
                    return;
                }
            }
            var ptr = target;
            // TODO: Do a deep tree traversal to remove the nodes under it
            while (true) {
                if (ptr === target && !ptr.node) break;
                if (ptr.node && ptr.node.length > 0) {
                    ptr = ptr.node[0];
                } else {
                    flatNodes.splice(flatNodes.indexOf(ptr), 1);
                    ptr = ptr.$parent;
                    ptr.node.splice(0, 1);
                    if (ptr.node.length == 0) {
                        delete ptr.node;
                        delete ptr.open;
                    }
                }
            }
            flatNodes.splice(flatNodes.indexOf(target), 1);
            var parent = target.$parent;
            parent.node.splice(target.$parentIndex, 1);
            for (var i = target.$parentIndex; i < parent.node.length; i++) {
                parent.node[i].$parentIndex = i;
            }
            if (parent.node.length == 0) {
                delete parent.node;
                delete parent.open;
            }
            $scope.$emit('fileModified', {
                event: 'deleteNode',
                parent: target.$parent.$['ID'],
                payload: target.$['ID']
            });
            $scope.selectNode('prev');
        };

        $scope.parseTasks = function () {
            $scope.loading=true;
            TaskService.parseTasks($state.params.fileId).then(function (data) {
                $scope.nodes = data.content;
                $scope.nodes.rootNode.open = true;
                $scope.nodes.rootNode.$$hashKey = 'object:0';
                $scope.loading = false;
                $scope.$emit('openId', {id: $state.params.fileId});
                $scope.$emit('selectNode', {node: $scope.nodes.rootNode});
            });
        };

        $scope.treeOptions = {
            dropped: function (event) {
                var sourceNode = event.source.nodesScope.myParent;
                var sourceIndex = event.source.index;
                var destNode = event.dest.nodesScope.myParent;
                var destIndex = event.dest.index;
                var element = event.source.nodeScope.$modelValue;
                if (sourceNode == null) {
                    return false;
                }
                if (destNode == null) {
                    return false;
                }
                for (var i = sourceIndex; i < sourceNode.node.length; i++) {
                    sourceNode.node[i].$parentIndex = i;
                }
                if (sourceNode.node.length == 0) {
                    delete sourceNode.node;
                    delete sourceNode.open;
                }
                element.$parent = destNode;
                for (var i = destIndex; i < destNode.node.length; i++) {
                    destNode.node[i].$parentIndex = i;
                }
                $timeout(function () {
                    $scope.$emit('fileModified', {
                        event: 'nodeMove',
                        parent: sourceNode.$['ID'],
                        payload: {
                            elementId: element.$['ID'], fromIndex: sourceIndex,
                            toParentId: destNode.$['ID'], toIndex: destIndex
                        }
                    });
                }, 0);
            }
        }
    })
;
