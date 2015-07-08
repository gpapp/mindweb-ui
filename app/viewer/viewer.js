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
    .controller('viewerController', function ($scope, $location, $anchorScroll) {
        $anchorScroll.yOffset = 50;
        $scope.$on('selectNode', function (event, data) {
            $scope.currentNode = data.node;
            $location.hash(data.node.$['ID']);
            event.stopPropagation();
        });
        $scope.$on('selectTab', function (event, data) {
            $scope.selectedTab = data.destination;
            event.stopPropagation();
        });
    })
    .controller('structureController', function ($scope, $rootScope, $state, $filter, FileApi) {

        $rootScope.$emit('$routeChangeStart');

        $rootScope.$on("closeFile", function (event, file) {
            if ($state.params.fileId === file.id) {
                $state.go('files.list');
            }
        });

        FileApi.load($state.params.fileId).then(function (data) {
            $scope.nodes = JSON.parse(data.content);
            $scope.nodes.map.open = true;
            $scope.$emit('selectNode', {node: $scope.nodes.map});
            $rootScope.$emit('$routeChangeSuccess');
        });

        $scope.setupParent = function (node, $modelValue, $index) {
            node.$parent = $modelValue;
            node.$parentIndex = $index;
        };

        $scope.nodeIcon = function (node) {
            if (node.node) {
                return node['open'] ? 'fa-chevron-down' : 'fa-chevron-right';
            }
            return 'hidden';
        };
        $scope.nodeToggleOpen = function (node) {
            node.open = !node.open;
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
                            if(!ptr.$parent) {
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
                    }
                    break;
                case 'unfold':
                    if (currentNode.node) {
                        currentNode.open = true;
                    }
                    break;
            }
        };
        $scope.addNode = function (event) {
            console.log(event);
        };
        $scope.addSubNode = function (event) {
            console.log(event);
        };
    })
    .controller('detailController', function ($scope, $http) {

        $http.get('app/viewer/iconlist.json')
            .then(function (res) {
                $scope.iconList = res.data;
            });

        $scope.moveIcon = function (pos, dir) {
            var icons = $scope.currentNode.icon;
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
        };

        $scope.deleteIcon = function (pos) {
            $scope.currentNode.icon.splice(pos, 1);
            if ($scope.currentNode.icon.length == 0) {
                delete $scope.currentNode.icon;
            }
        };

        $scope.addIcon = function (name) {
            if ($scope.currentNode.icon) {
                $scope.currentNode.icon.push({'$': {BUILTIN: name}});
            } else {
                $scope.currentNode.icon = [{'$': {BUILTIN: name}}];
            }
        };

        $scope.selectTab = function (destination) {
            $scope.$emit('selectTab', {destination: destination});
        };
    });
