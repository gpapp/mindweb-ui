angular.module('MindWebUi.viewer.taskController', [
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree',
        'angular-markdown',
        'angular-keyboard',
        'MindWebUi.node.service'
    ])
    .controller('viewerTaskController', function ($scope, $rootScope, $filter, $timeout,NodeService) {

        inifializeTasklist();

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

            if (newNode.$parent.node) {
                newNode.$parent.node.push(newNode);
            } else {
                newNode.$parent.node = [newNode];
            }
            newNode.$parentIndex = newNode.$parent.node.length - 1;

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
                payload: target.$['ID'],
                oldValue: target
            });
            $scope.selectNode('prev');
        };

        $scope.treeOptions = {
            dropped: function (event) {
                var element = event.source.nodeScope.$modelValue;
                var sourceNode = event.source.nodesScope.$nodeScope.$modelValue;
                var sourceIndex = event.source.index;
                var destNode = event.dest.nodesScope.$nodeScope.$modelValue;
                var destIndex = event.dest.index;
                if (sourceNode == null) {
                    sourceNode = $scope.$parent.nodes.rootNode;
                }
                if (destNode == null) {
                    destNode = $scope.$parent.nodes.rootNode;
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
                }, 10);
            }
        };

        $scope.getTaskViewType = function () {
            if (!$scope.$parent.$parent.loading) {
                return NodeService.getAttribute( $scope.nodes.rootNode,'taskViewType','project');
            }
        };
        $scope.setTaskViewType = function (viewType) {
            NodeService.setAttribute($scope, $scope.nodes.rootNode,'taskViewType',viewType);
        };

        function inifializeTasklist() {
            console.log('intitialize');
            $scope.tasklist = [];
            NodeService.walknodes($scope.nodes.rootNode,function(){
                return false;
            })
        }
    })
;
