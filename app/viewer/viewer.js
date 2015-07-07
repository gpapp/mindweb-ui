angular.module('MindWebUi.viewer', [
    'MindWebUi.file.service',
    'ui.router',
    'angular-markdown',
    'ui.bootstrap.tabs',
    'ui.tree',
    'angular-keyboard'
])
    .filter('escape', function() {
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
    .controller('viewerController', function ($scope, $rootScope) {
        $scope.$on('selectNode', function (event, data) {
            $rootScope.Ui.turnOn('detailPanel');
            $scope.currentNode = data.node;
            $scope.selectedTab = data.destination;
            event.stopPropagation();
        });
    })
    .controller('structureController', function ($scope, $rootScope, $state, $filter, FileApi) {

        $rootScope.$emit('$routeChangeStart');

        $rootScope.$on("closeFile", function (event, file) {
            if($state.params.fileId === file.id){
                $state.go('files.list');
            }
        });

        FileApi.load($state.params.fileId).then(function (data) {
            $scope.nodes = JSON.parse(data.content);
            $scope.nodes.open = true;
            $rootScope.$emit('$routeChangeSuccess');
        });

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
            $scope.$emit('selectNode', {node: node, destination: destination});
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
        };

        $scope.addIcon = function (name) {
            $scope.currentNode.icon.push({'$': {BUILTIN: name}});
        };

        $scope.lookupAndAddIcon = function(event){
            console.log(event);
        }
    });
