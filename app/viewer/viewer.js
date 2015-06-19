angular.module('MindWebUi.viewer', [
    'MindWebUi.file.service',
    'ui.router',
    'angular-markdown',
    'ui.bootstrap.tabs',
    'mobile-angular-ui.gestures'
])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider) {
            $stateProvider
                .state('viewer', {
                    abstract: true,
                    url: '/viewer',
                    templateUrl: '/app/viewer/viewerTemplate.html',
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
    .controller('structureController', function ($scope, $rootScope, $state, $filter, FileApi) {

        $rootScope.loading = true;

        FileApi.load($state.params.fileId).then(function (data) {
            $scope.nodes = JSON.parse(data.content);
            $scope.nodes.open = true;
            $rootScope.loading = false;
        });

        $scope.nodeIcon = function (node) {
            if (node.nodes) {
                for(var i= 0, tot=node.nodes.length; i<tot; i++) {
                    if (node.nodes[i].name === 'node') {
                        return node['open'] ? 'fa-chevron-down' : 'fa-chevron-right';
                    }
                }
            }
            return 'hidden';
        };
        $scope.nodeToggleOpen = function (node) {
            node.open = !node.open;
        };
        $scope.refreshDetail = function (node) {
            $rootScope.$broadcast('refreshDetail', {node: node});
        };

    }
)
    .controller('detailController', function ($scope) {
        $scope.$on('refreshDetail', function (event, data) {
            $scope.node = data.node;
        });

    });
