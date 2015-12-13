angular.module('MindWebUi.viewer.taskController', [
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree',
        'angular-markdown',
        'cfp.hotkeys',
        'MindWebUi.node.service'
    ])
    .controller('viewerTaskController', function ($scope, $rootScope, $filter, $timeout, hotkeys, NodeService) {

        $scope.$on('mobile-angular-ui.state.changed.iconDialog', function (e, newVal, oldVal) {
            if (newVal === false) {
                bindKeys();
            }
        });
        $scope.$on('mobile-angular-ui.state.changed.detailPanel', function (e, newVal, oldVal) {
            if (newVal === false) {
                bindKeys();
            }
        });


        initializeTasklist();
        bindKeys();

        $scope.longPressNode = function (node) {
            $scope.$emit('selectNode', {node: node.node});
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
            var currentNode = findNodeInTasks($scope.currentNode);
            if (!currentNode) {
                currentNode = findNodeInProjects($scope.currentNode);
            }
            var rootNodes = [];
            var rootIndex = -1;
            var parentProjectIndex = -1;
            var parentNodeIndex = -1;
            if (currentNode.project) {
                if (currentNode.project.nodes) {
                    parentNodeIndex = currentNode.project.nodes.indexOf(currentNode);
                }
                if (currentNode.project.projects) {
                    parentProjectIndex = currentNode.project.projects.indexOf(currentNode);
                }
            }
            for (var i = 0; i < $scope.projectList.length; i++) {
                if (!$scope.projectList[i].project) {
                    if ($scope.projectList[i] == currentNode) {
                        rootIndex = rootNodes.length;
                    }
                    rootNodes.push($scope.projectList[i]);
                }
            }

            switch (event) {
                case 'prev':
                    if (rootIndex == 0) {
                        break;
                    }
                    if (rootIndex > 0 && !rootNodes[rootIndex - 1].node.open) {
                        $scope.$emit('selectNode', {node: rootNodes[rootIndex - 1].node});
                    } else {
                        //dig down to last open child
                        var ptr = currentNode.project;
                        if (!ptr) {
                            ptr = rootNodes[rootIndex - 1];
                        } else if (parentNodeIndex > 0) {
                            ptr = ptr.nodes[parentNodeIndex - 1];
                        } else if (parentProjectIndex > 0) {
                            ptr = ptr.projects[parentProjectIndex - 1];
                        } else if (parentNodeIndex == 0) {
                            if (ptr.projects) {
                                ptr = ptr.projects[ptr.projects.length - 1];
                            } else {
                                $scope.$emit('selectNode', {node: ptr.node});
                                break;
                            }
                        } else if (parentProjectIndex == 0) {
                            $scope.$emit('selectNode', {node: ptr.node});
                            break;
                        }
                        do {
                            var ptrProjectIndex = ptr.projects ? ptr.projects.indexOf(ptr) : -1;
                            var ptrNodeIndex = ptr.nodes ? ptr.nodes.indexOf(ptr) : -1;
                            if (!ptr.node.open || (!ptr.nodes && !ptr.projects)) {
                                $scope.$emit('selectNode', {node: ptr.node});
                                break;
                            }
                            if (ptr.nodes) {
                                if (ptr.nodes[ptr.nodes.length - 1].node.open) {
                                    ptr = ptr.nodes[ptr.nodes.length - 1];
                                } else {
                                    $scope.$emit('selectNode', {node: ptr.nodes[ptr.nodes.length - 1].node});
                                    break;
                                }
                            }
                            if (ptr.projects) {
                                if (ptr.projects[ptr.projects.length - 1].node.open) {
                                    ptr = ptr.projects[ptr.projects.length - 1];
                                } else {
                                    $scope.$emit('selectNode', {node: ptr.projects[ptr.projects.length - 1].node});
                                    break;
                                }

                            }
                        } while (true);
                    }
                    break;
                case 'next':
                    if (!currentNode.project && !currentNode.node.open) {
                        if (rootIndex < rootNodes.length - 1) {
                            $scope.$emit('selectNode', {node: rootNodes[rootIndex + 1].node});
                        }
                    } else if (currentNode.projects && currentNode.node.open) {
                        $scope.$emit('selectNode', {node: currentNode.projects[0].node});
                    } else if (currentNode.nodes && currentNode.node.open) {
                        $scope.$emit('selectNode', {node: currentNode.nodes[0].node});
                    } else if (currentNode.project.projects && parentProjectIndex >= 0 && parentProjectIndex < currentNode.project.projects.length - 1) {
                        $scope.$emit('selectNode', {node: currentNode.project.projects[parentProjectIndex + 1].node});
                    } else if (currentNode.project.projects && parentProjectIndex >= 0 && parentProjectIndex == currentNode.project.projects.length - 1 && currentNode.project.nodes) {
                        $scope.$emit('selectNode', {node: currentNode.project.nodes[0].node});
                    } else if (currentNode.project.nodes && parentNodeIndex >= 0 && parentNodeIndex < currentNode.project.nodes.length - 1) {
                        $scope.$emit('selectNode', {node: currentNode.project.nodes[parentNodeIndex + 1].node});
                    } else {
                        var ptr = currentNode.project;
                        do {
                            if (!ptr.project) {
                                rootIndex = rootNodes.indexOf(ptr);
                                if (rootIndex < rootNodes.length - 1) {
                                    $scope.$emit('selectNode', {node: rootNodes[rootIndex + 1].node});
                                }
                                break;
                            }
                            var ptrProjectIndex = ptr.project.projects ? ptr.project.projects.indexOf(ptr) : -1;
                            var ptrNodeIndex = ptr.project.nodes ? ptr.project.nodes.indexOf(ptr) : -1;
                            if (ptrProjectIndex >= 0 && ptrProjectIndex < ptr.project.projects.length - 1) {
                                $scope.$emit('selectNode', {node: ptr.project.projects[ptrProjectIndex + 1].node});
                            } else if (ptrNodeIndex >= 0 && ptrNodeIndex < ptr.project.nodes.length - 1) {
                                $scope.$emit('selectNode', {node: ptr.project.nodes[ptrNodeIndex + 1].node});
                            } else if (ptrProjectIndex >= 0 && ptrProjectIndex == ptr.project.projects.length - 1) {
                                if (ptr.project.nodes) {
                                    $scope.$emit('selectNode', {node: ptr.project.nodes[0].node});

                                } else {
                                    ptr = ptr.project;
                                    continue;
                                }
                            } else if (ptrNodeIndex >= 0 && ptrNodeIndex == ptr.project.nodes.length - 1) {
                                ptr = ptr.project;
                                continue;
                            }
                            break;
                        } while (true);
                    }
                    break;
                case 'fold':
                    if (currentNode.node) {
                        currentNode.node.open = false;
                        $scope.$emit('fileModified', {
                            event: 'nodeFold',
                            parent: currentNode.node.$['ID'],
                            payload: false
                        });
                    }
                    break;
                case 'unfold':
                    if (currentNode.node) {
                        currentNode.node.open = true;
                        $scope.$emit('fileModified', {
                            event: 'nodeFold',
                            parent: currentNode.node.$['ID'],
                            payload: true
                        });
                    }
                    break;
            }
        };
        $scope.addTask = function (target) {
            var newNode = {};
            var timeStamp = new Date().getTime();
            if (typeof target === 'string') {
                newNode.$parent = target === 'current' ? $scope.currentNode : $scope.currentNode.$parent;
                if (!newNode.$parent) {
                    newNode.$parent = $scope.currentNode;
                }
            } else {
                newNode.$parent = target.node;
            }

            newNode.$ = {CREATED: timeStamp, ID: 'ID_' + timeStamp, MODIFIED: timeStamp, TEXT: 'New Task'};
            newNode.nodeMarkdown = 'New Task';
            NodeService.addConfigIcon($scope, newNode, 'task');
            var minId = -1;

            if (newNode.$parent.node) {
                newNode.$parent.node.push(newNode);
            } else {
                newNode.$parent.node = [newNode];
            }
            newNode.$parentIndex = newNode.$parent.node.length - 1;

            // Make sure the node is open, so the new node is shown
            newNode.$parent.open = true;
            var newTask = taskFromNode(newNode);

            $scope.taskList.push(newTask);
            $scope.$emit('selectNode', {node: newNode});
            $scope.$emit('selectTab', {destination: 'content', selectAll: true});
            $scope.$emit('fileModified', {event: 'newNode', parent: newNode.$parent.$['ID'], payload: newNode});
        };

        $scope.addProject = function (target) {
            var newNode = {};
            var timeStamp = new Date().getTime();
            if (typeof target === 'string') {
                newNode.$parent = target === 'current' ? $scope.currentNode : $scope.currentNode.$parent;
                if (!newNode.$parent) {
                    newNode.$parent = $scope.currentNode;
                }
            } else {
                newNode.$parent = target.node;
            }

            newNode.$ = {CREATED: timeStamp, ID: 'ID_' + timeStamp, MODIFIED: timeStamp, TEXT: 'New Project'};
            newNode.nodeMarkdown = 'New Project';
            NodeService.addConfigIcon($scope, newNode, 'project');
            var minId = -1;

            if (newNode.$parent.node) {
                newNode.$parent.node.push(newNode);
            } else {
                newNode.$parent.node = [newNode];
            }
            newNode.$parentIndex = newNode.$parent.node.length - 1;

            // Make sure the node is open, so the new node is shown
            newNode.$parent.open = true;
            var newTask = projectFromNode(newNode);

            $scope.projectList.push(newTask);
            $scope.$emit('selectNode', {node: newNode});
            $scope.$emit('selectTab', {destination: 'content', selectAll: true});
            $scope.$emit('fileModified', {event: 'newNode', parent: newNode.$parent.$['ID'], payload: newNode});
        };


        $scope.deleteNode = function (target) {
            if (typeof target === 'string') {
                target = $scope.currentNode;
            }
            var cur = findNodeInTasks(target);
            // remove from real tree
            var parent = cur.node.$parent;
            parent.node.splice(cur.node.$parentIndex, 1);
            for (var i = target.$parentIndex; i < parent.node.length; i++) {
                parent.node[i].$parentIndex = i;
            }
            if (parent.node.length == 0) {
                delete parent.node;
                delete parent.open;
            }
            // remove from task tree
            if (cur.project.projects) {
                cur.project.projects.splice(cur.project.projects.indexOf(cur), 1);
            }
            if (cur.project.nodes) {
                cur.project.nodes.splice(cur.project.nodes.indexOf(cur), 1);
            }
            if ($scope.projectList.indexOf(cur) > 0) {
                $scope.projectList.splice($scope.projectList.indexOf(cur), 1);

            }
            if ($scope.taskList.indexOf(cur) > 0) {
                $scope.taskList.splice($scope.taskList.indexOf(cur), 1);

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
            beforeDrag: function (event) {
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

        $scope.isTaskOnly = function (parentNode) {
            return function (node, index, array) {
                if (!node.project) {
                    return true;
                }
                if (!node.project.projects) {
                    return true;
                }
                return node.project.projects.indexOf(node) > -1;
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
            var newTask = findNodeInTasks(node);
            if (!newTask) {
                var newTask = findNodeInProjects(node);
            }
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

        function initializeTasklist() {
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

        function bindKeys() {
            hotkeys.bindTo($scope)
                .add({
                    combo: 'up',
                    description: 'Previous node',
                    callback: function () {
                        $scope.selectNode('prev')
                    }
                })
                .add({
                    combo: 'down',
                    description: 'Next node',
                    callback: function () {
                        $scope.selectNode('next')
                    }
                })
                .add({
                    combo: 'right',
                    description: 'Unfold node',
                    callback: function () {
                        $scope.selectNode('unfold');
                    }
                })
                .add({
                    combo: 'left',
                    description: 'Fold node',
                    callback: function () {
                        $scope.selectNode('fold');
                    }
                })
                .add({
                    combo: 'space',
                    description: 'Display details',
                    callback: function () {
                        $scope.detailToggleOpen($scope.currentNode);
                    }
                })
                .add({
                    combo: 'enter',
                    description: 'Add subtask',
                    callback: function () {
                        $scope.addTask('current');
                    }
                })
                .add({
                    combo: 'ins',
                    description: 'Add subproject',
                    callback: function () {
                        $scope.addProject('current');
                    }
                })
                .add({
                    combo: 'del',
                    description: 'Remove node',
                    callback: function () {
                        $scope.deleteNode('current');
                    }
                })
            ;


        }
    });
