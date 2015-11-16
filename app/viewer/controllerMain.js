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
        'MindWebUi.task.service'
    ])
    .controller('viewerMainController',
        function ($scope,
                  $rootScope,
                  $state,
                  $location,
                  $anchorScroll,
                  $interval,
                  FileService,
                  PublicService,
                  TaskService) {
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
                // remove circular references
                if (data.payload && typeof data.payload == 'object') {
                    var nodeCopy = (data.payload instanceof Array) ? [] : {};
                    angular.copy(data.payload, nodeCopy);
                    delete nodeCopy.$parent;
                    delete nodeCopy.$parentIndex;
                    data.payload = nodeCopy;
                }
                $scope.msgStack = msgStack;
                msgStack.push(data);
                event.stopPropagation();
            });
            $scope.$on("$destroy", function (event) {
                    if(saveTimer){
                        $interval.cancel(saveTimer);
                        performSave();
                    }
                }
            );

            $scope.loading = true;

            $scope.getViewType = function () {
                if (!$scope.loading) {
                    return $scope.nodes.$['viewType'] ? $scope.nodes.$['viewType'] : 'tree';
                }
            };
            $scope.setViewType = function (viewType) {
                $scope.nodes.$['viewType'] = viewType;
            };

            $scope.isProject = function (node) {
                return hasConfigIcon(node, 'Project');
            };
            $scope.isTask = function (node) {
                return hasConfigIcon(node, 'Task');
            };
            $scope.isDone = function (node) {
                return hasConfigIcon(node, 'Done');
            };
            $scope.markProject = function (node) {
                addConfigIcon(node,'Project');
            };
            $scope.markTask = function (node) {
                addConfigIcon(node,'Task');
            };
            $scope.markDone = function (node,status) {
                status?addConfigIcon(node,'Done'):removeConfigIcon(node,'Done');
            };
            $scope.parseTasks = function () {
                $scope.loading = true;
                TaskService.parseTasks($state.params.fileId).then(function (data) {
                    postLoad(data);
                });
            };
            $scope.jumptoLink = function (link) {
                if (link[0] == '#') {
                    walknodes($scope.nodes.rootNode, function (node) {
                        if (node.$['ID'] === link.substr(1)) {
                            var nodeparent = node;
                            while (nodeparent.$parent) {
                                nodeparent.open = true;
                                nodeparent = nodeparent.$parent;
                            }
                            selectNode(node);
                            return true;
                        }
                        return false;
                    })
                } else {
                    $window.open(link, '_blank');
                }
            };

            PublicService.load($state.params.fileId).then(function (data) {
                postLoad(data);
            });

            var iconConfig = {project: 'list', task: 'yes', nextaction: 'bookmark', done: 'button_ok'};

            function postLoad(data) {
                $scope.file = data.file;
                $scope.editable = data.editable;
                $scope.nodes = data.content;
                $scope.nodes.rootNode.open = true;
                $scope.nodes.rootNode.$$hashKey = 'object:0';
                walknodes($scope.nodes.rootNode, function (node) {
                        if (/^Icon: /.test(node.nodeMarkdown)) {
                            if (!node.icon) {
                                $rootScope.$emit("$applicationError", "Icon not specified for node:" + node.nodeMarkdown);
                            } else {
                                iconConfig[node.nodeMarkdown.replace(/^Icon:\s*/, '').toLowerCase()] = node.icon[0].$['BUILTIN'];
                            }
                        }
                        if (!node.node) return false;
                        for (var i = 0; i < node.node.length; i++) {
                            curNode = node.node[i];
                            curNode.$parent = node;
                            curNode.$parentIndex = i;
                        }
                        return false;
                    }
                );
                $scope.$emit('openId', {id: $state.params.fileId});
                // TODO: Select anchored node else select rootNode
                if ($location.$$hash.indexOf("ID_")==0) {
                    $scope.jumptoLink("#"+$location.$$hash)    ;
                } else {
                    selectNode($scope.nodes.rootNode);                        
                }

                if ($scope.editable){
                    saveTimer = $interval(function () {
                        performSave();
                    }, 10000);
                }
                $scope.loading = false;
            }

            function configToIcon(icon) {
                    if(iconConfig.hasOwnProperty(icon.toLowerCase())) {
                        return iconConfig[icon.toLowerCase()];
                    }
                return null;
            }

            function hasConfigIcon(node, icon) {
                if (!node) return false;
                if (!node.icon) return false;
                var toSearch = configToIcon(icon);
                if (!toSearch) {
                    return false;
                }
                for(var i=0; i<node.icon.length;i++){
                    if(node.icon[i].$['BUILTIN']===toSearch){
                        return true;
                    }
                }
                return false;
            }

            function addConfigIcon(node, icon) {
                if (!node) return;
                var toSearch = configToIcon(icon);
                if (!toSearch) {
                    return;
                }
                if (!node.icon) {
                    node.icon = [];
                }
                for(var i=0; i<node.icon.length;i++){
                    if(node.icon[i].$['BUILTIN']===toSearch){
                        return;
                    }
                }
                node.icon.unshift({'$': {BUILTIN: toSearch}});
                $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
            }
            function removeConfigIcon(node, icon) {
                if (!node) return;
                if (!node.icon) return;
                var toSearch = iconConfig[icon];
                if (!toSearch) {
                    return;
                }
                for(var i=0; i<node.icon.length;i++){
                    if(node.icon[i].$['BUILTIN'].toLowerCase()===toSearch.toLowerCase()){
                        node.icon.splice(i,1);
                    }
                }
                if(node.icon.length==0){
                    delete node.icon;
                }
                $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
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

            function walknodes(node, fn) {
                var ptr;
                var index;
                var visited = [[node, 0]];
                while (visited.length > 0) {
                    var pos = visited.pop();
                    ptr = pos[0];
                    index = pos[1];
                    if (!ptr.node) {
                        if (fn(ptr)) return;
                        continue;
                    } else if (index < ptr.node.length) {
                        if (fn(ptr)) return;
                        visited.push([ptr, index + 1]);
                        visited.push([ptr.node[index], 0]);
                    } else {

                    }
                }
            }
        })
;
