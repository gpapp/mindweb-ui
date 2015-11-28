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
    .controller('viewerTaskController', function ($scope, $rootScope, $filter, $timeout, NodeService) {

        inifializeTasklist();

        $scope.longPressNode = function (node) {
            $scope.$emit('selectNode', node);
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
                beforeDrag: function (event){
                        return false;
                },
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
                return NodeService.getAttribute($scope.nodes.rootNode, 'taskViewType', 'project');
            }
        };
        $scope.setTaskViewType = function (viewType) {
            NodeService.setAttribute($scope, $scope.nodes.rootNode, 'taskViewType', viewType);
        };


        $scope.hasConfigIcon = function (key) {
            return NodeService.configToIcon(key);
        };

        $scope.isParentComparator = function (parentNode) {
            return function (node, index, array) {
                if (!node.project && !parentNode) {
                    return true;
                }
                if (!node.project || !parentNode) {
                    return false;
                }
                return node.project.node.$['ID'] === parentNode.node.$['ID'];
            }
        };

        var lastGroup;
        var groups;
        $scope.getGroupedTasks = function () {
            var type = $scope.getTaskViewType();
            if (lastGroup != type) {
                groups = {};
                lastGroup = type;
            }
            for (var i = 0; i < $scope.taskList.length; i++) {
                var curNode = $scope.taskList[i];
                switch (type) {
                    case 'responsible':
                        var responsibleText = NodeService.getAttribute(curNode.node, 'Who');
                        if (responsibleText) {
                            var responsibleList = responsibleText.split(',');
                            for (var j = 0; j < responsibleList.length; j++) {
                                var list = groups[responsibleList[j]];
                                if (!list) {
                                    list = [];
                                    groups[responsibleList[j]] = list;
                                }
                                if (list.indexOf(curNode) < 0) {
                                    list.push(curNode);
                                }
                            }
                        } else {
                            var list = groups['Undefined'];
                            if (!list) {
                                list = [];
                                groups['Undefined'] = list;
                            }
                            if (list.indexOf(curNode) < 0) {
                                list.push(curNode);
                            }
                        }
                        break;
                    case 'timeline':
                        var due = NodeService.getAttribute(curNode.node, 'When');
                        if (due) {
                            var list = groups[due];
                            if (!list) {
                                list = [];
                                groups[due] = list;
                            }
                            if (list.indexOf(curNode) < 0) {
                                list.push(curNode);
                            }
                        } else {
                            var list = groups['Undefined'];
                            if (!list) {
                                list = [];
                                groups['Undefined'] = list;
                            }
                            if (list.indexOf(curNode) < 0) {
                                list.push(curNode);
                            }
                        }
                        break;
                    case 'context':
                        var contextText = NodeService.getAttribute(curNode.node, 'Where');
                        if (contextText) {
                            var contextList = contextText.split(',');
                            for (var j = 0; j < contextList.length; j++) {
                                var list = groups[contextList[j]];
                                if (!list) {
                                    list = [];
                                    groups[contextList[j]] = list;
                                }
                                if (list.indexOf(curNode) < 0) {
                                    list.push(curNode);
                                }
                            }
                        } else {
                            var list = groups['Undefined'];
                            if (!list) {
                                list = [];
                                groups['Undefined'] = list;
                            }
                            if (list.indexOf(curNode) < 0) {
                                list.push(curNode);
                            }
                        }
                        break;
                }
            }
            return groups;
        };

        function findTaskProjectNode(taskNode) {
            var ptr = taskNode.$parent;
            while (ptr.$parent) {
                if (NodeService.hasConfigIcon(ptr, 'Project')) {
                    return ptr;
                }
                ptr = ptr.$parent;
            }
            return taskNode.$parent;
        }


        function findNodeInTasks(node) {
            for (var i = 0; i < $scope.taskList.length; i++) {
                if (node.$['ID'] === $scope.taskList[i].node.$['ID']) {
                    return $scope.taskList[i];
                }
            }
            return null;
        }

        function findNodeInProjects(node) {
            for (var i = 0; i < $scope.projectList.length; i++) {
                if (node.$['ID'] === $scope.projectList[i].node.$['ID']) {
                    return $scope.projectList[i];
                }
            }
            return null;
        }

        function projectFromNode(node) {
            var foundNode = {node: node};
            var ptr = node.$parent;
            var lastPrj = foundNode;
            while (ptr) {
                var parentPrj = findNodeInProjects(ptr);
                if (parentPrj) {
                    lastPrj.project = parentPrj;
                    if (!parentPrj.projects) {
                        parentPrj.projects = [];
                    }
                    parentPrj.projects.push(lastPrj);
                    lastPrj = parentPrj;
                }
                ptr = ptr.$parent;
            }
            return foundNode;
        }

        function taskFromNode(node) {
            // Find task in projects first
            var newTask = findNodeInProjects(node);
            if (!newTask) {
                newTask = {node: node};
            }
            var projectNode = findTaskProjectNode(node);
            var parentProject = findNodeInProjects(projectNode);
            if (!parentProject) {
                parentProject = projectFromNode(projectNode);
                $scope.projectList.push(parentProject);
            }
            if (!parentProject.nodes) {
                parentProject.nodes = [];
            }
            parentProject.nodes.push(newTask);
            newTask.project = parentProject;
            return newTask;
        }

        function inifializeTasklist() {          
            $scope.taskList = [];
            $scope.projectList = [];
            NodeService.walknodes($scope.nodes.rootNode, function (node) {
                if (NodeService.hasConfigIcon(node, "task")) {
                    var newTask = taskFromNode(node);
                    $scope.taskList.push(newTask);
                }
                if (NodeService.hasConfigIcon(node, "project")) {
                    var newPrj = findNodeInTasks(node);
                    if (newPrj) {
                        $scope.projectList.push(newPrj);
                    } else {
                        newPrj = findNodeInProjects(node);
                    }
                    if (!newPrj) {
                        newPrj = projectFromNode(node);
                        $scope.projectList.push(newPrj);
                    }
                }
                return false;
            })
        }
    })
;
