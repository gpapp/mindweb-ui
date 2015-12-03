angular.module('MindWebUi.viewer.mainController', [
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
        'MindWebUi.node.service'
    ])
    .controller('viewerMainController',
        function ($scope,
                  $rootScope,
                  $state,
                  $location,
                  $anchorScroll,
                  $interval,
                  NodeService,
                  FileService,
                  PublicService,
                  TaskService) {
            const IconRegExp = /^Icon:\s*(.*)/;
            var msgStack = [];
            var saveMutex = false;
            var saveTimer;

            $anchorScroll.yOffset = 50;
            $rootScope.$on("closeFile", function (event, file) {
                if ($state.params.fileId === file.id) {
                    $state.go('files.list');
                }
            });
            $scope.$on('openId', function (event, data) {
                $scope.openId = data.id;
                event.stopPropagation();
            });
            $scope.$on('selectNode', function (event, data) {
                selectNode(data.node);
                event.stopPropagation();
            });
            $scope.$on('selectTab', function (event, data) {
                if (data.destination != 'content') {
                    $scope.selectedTab = data.destination;
                } else {
                    $scope.selectedTab = 'details';
                }
                focus(data.destination + 'ID');
                event.stopPropagation();
            });
            $scope.$on('fileModified', function (event, data) {
                $rootScope.getCurrentUser().then(
                    function (user) {
                        if (user) {
                            if (data.event === 'deleteNode') {
                                NodeService.nodeDeleteHook($scope, $scope.nodes.rootNode, data.oldValue);
                            }
                            if (data.event === 'nodeText' || data.event === 'nodeModifyIcons') {
                                var node = NodeService.findNodeById($scope.nodes.rootNode, data.parent);
                                NodeService.nodeChangeHook($scope, $scope.nodes.rootNode, node, data.oldValue);
                            }
                            // remove circular references
                            if (data.payload && typeof data.payload == 'object') {
                                var nodeCopy = (data.payload instanceof Array) ? [] : {};
                                angular.copy(data.payload, nodeCopy);
                                delete nodeCopy.$parent;
                                delete nodeCopy.$parentIndex;
                                data.payload = nodeCopy;
                            }
                            delete data.oldValue;
                            $scope.msgStack = msgStack;
                            msgStack.push(data);
                        }
                        event.stopPropagation();
                    }
                )
            });
            $scope.$on("$destroy", function (event) {
                    if (saveTimer) {
                        $interval.cancel(saveTimer);
                        performSave();
                    }
                }
            );

            $scope.loading = true;

            $scope.getViewType = function () {
                if (!$scope.loading) {
                    return NodeService.getAttribute($scope.nodes.rootNode, 'viewType', 'tree');
                }
            };
            $scope.setViewType = function (viewType) {
                NodeService.setAttribute($scope, $scope.nodes.rootNode, 'viewType', viewType);
            };

            $scope.isProject = function (node) {
                return NodeService.hasConfigIcon(node, 'Project');
            };
            $scope.isTask = function (node) {
                return NodeService.hasConfigIcon(node, 'Task');
            };
            $scope.isDone = function (node) {
                return NodeService.hasConfigIcon(node, 'Done');
            };
            $scope.markProject = function (node) {
                NodeService.addConfigIcon($scope, node, 'Project');
            };
            $scope.markTask = function (node) {
                NodeService.addConfigIcon($scope, node, 'Task');
            };
            $scope.markDone = function (node, status) {
                status ? NodeService.addConfigIcon($scope, node, 'Done') : NodeService.removeConfigIcon($scope, node, 'Done');
            };

            $scope.downloadFreeplane = function (target) {
                FileService.exportFreeplane($scope.file.id).then(
                    function (data) {
                        var blob = new Blob([data], {type: 'application/x-freemind'});
                        saveAs(blob, $scope.file.name);
                    },
                    function (error) {
                        alert("Cannot save file:" + error);
                    }
                )
            };

            $scope.parseTasks = function () {
                $scope.loading = true;
                TaskService.parseTasks($state.params.fileId).then(function (data) {
                    postLoad(data);
                });
            };
            $scope.jumptoLink = function (link) {
                if (link[0] == '#') {
                    var node = NodeService.findNodeById($scope.nodes.rootNode, link.substr(1));
                    if (node) {
                        selectNode(node);
                        // Open all parent nodes
                        var nodeparent = node;
                        while (nodeparent.$parent) {
                            nodeparent.open = true;
                            nodeparent = nodeparent.$parent;
                        }
                    }
                } else {
                    $window.open(link, '_blank');
                }
            };

            PublicService.load($state.params.fileId).then(function (data) {
                postLoad(data);
            });

            function postLoad(data) {
                $scope.file = data.file;
                $scope.editable = $scope.file.editable;
                $scope.nodes = data.content;
                $scope.nodes.rootNode.open = true;
                $scope.nodes.rootNode.$$hashKey = 'object:0';
                NodeService.walknodes($scope.nodes.rootNode, function (node) {
                        if (!node.node) return false;
                        for (var i = 0; i < node.node.length; i++) {
                            var curNode = node.node[i];
                            curNode.$parent = node;
                            curNode.$parentIndex = i;
                        }
                        return false;
                    }
                );
                NodeService.loadConfig($scope.nodes.rootNode);

                $scope.$emit('openId', {id: $state.params.fileId});
                if ($location.$$hash.indexOf("ID_") == 0) {
                    $scope.jumptoLink("#" + $location.$$hash);
                } else {
                    selectNode($scope.nodes.rootNode);
                }

                if ($scope.editable) {
                    saveTimer = $interval(function () {
                        performSave();
                    }, 10000);
                }
                $scope.loading = false;
            }

            function selectNode(node) {
                $scope.currentNode = node;
                $scope.currentEditor = {
                    text: node.nodeMarkdown,
                    detail: node.detailMarkdown,
                    note: node.noteMarkdown
                };
                $location.hash(node.$['ID']);
            }

            function performSave() {
                if (msgStack.length > 0 && !saveMutex) {
                    saveMutex = true;
                    var messages = [];
                    for (var i = 0, len = msgStack.length; i < len; i++) {
                        messages.push(msgStack[i]);
                    }
                    FileService.save($scope.openId, messages).then(function (data) {
                            msgStack.splice(0, data.length);
                            saveMutex = false;
                        }, function (error) {
                            saveMutex = false;
                        }
                    );
                }
            }

        })
;
