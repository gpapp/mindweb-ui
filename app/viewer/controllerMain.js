angular.module('MindWebUi.viewer.mainController', [
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree',
        'angular-markdown',
        'cfp.hotkeys',
        'MindWebUi.public.service',
        'MindWebUi.file.service',
        'MindWebUi.task.service',
        'MindWebUi.node.service'
    ])
    .controller('viewerMainController',
        function ($scope,
                  $rootScope,
                  $state,
                  $stateParams,
                  $location,
                  $anchorScroll,
                  $interval,
                  $timeout,
                  NodeService,
                  FileService,
                  PublicService,
                  TaskService,
                  SharedState,
                  hotkeys,
                  focusElement) {
            const IconRegExp = /^Icon:\s*(.*)/;
            var msgStack = [];
            var saveMutex = false;
            var saveTimer;

            bindKeys();

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
                focusElement(data.destination + 'ID', data.selectAll);
                SharedState.turnOn('detailPanel');
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
                //TODO: BAD ASYNC
                performSave();
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

            if(!$state.current.data.displayOnly){
                PublicService.load($state.params.fileId).then(function (data) {
                    postLoad(data);
                });
            } else {
                postLoad($state.params.fileContent);
            }

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

            function bindKeys() {
                hotkeys.bindTo($scope)
                    .add({
                        combo: ['?', 'alt+h'],
                        description: 'Show help',
                        persistent: false,
                        callback: function (event, hotkey) {
                            hotkeys.toggleCheatSheet();
                        }
                    })
                    .add({
                        combo: 'f2',
                        description: 'Edit content',
                        allowIn: ['TEXTAREA'],
                        persistent: false,
                        callback: function () {
                            $scope.$emit('selectTab', {destination: 'content'});
                        }
                    })
                    .add({
                        combo: 'shift+f2',
                        description: 'Edit detail',
                        allowIn: ['TEXTAREA'],
                        persistent: false,
                        callback: function () {
                            $scope.$emit('selectTab', {destination: 'details'});
                        }
                    })
                    .add({
                        combo: 'ctrl+shift+f2',
                        description: 'Edit notes',
                        allowIn: ['TEXTAREA'],
                        persistent: false,
                        callback: function () {
                            $scope.$emit('selectTab', {destination: 'notes'});
                        }
                    })
                    .add({
                        combo: 'ctrl+f2',
                        description: 'Edit icons',
                        allowIn: ['TEXTAREA'],
                        persistent: false,
                        callback: function () {
                            $scope.$emit('selectTab', {destination: 'icons'});
                            $timeout(function () {
                                SharedState.turnOn('iconDialog');
                            }, 100);
                        }
                    })
                    .add({
                        combo: 'f9',
                        description: 'Edit properties',
                        allowIn: ['TEXTAREA'],
                        persistent: false,
                        callback: function () {
                            $scope.$emit('selectTab', {destination: 'properties'});
                        }
                    })
                ;
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
