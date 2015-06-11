angular.module('MindWebUi.viewer', [
    'MindWebUi.file.service',
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
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
    .controller('structureController', function ($scope, $rootScope, $state, FileApi) {

        FileApi.load($state.params.fileId).then(function (data) {
            $scope.nodes = data.fileVersion.content;
            $scope.nodes.open = true;
        });

        $scope.nodeIcon = function (node) {
            if (node.nodes) {
                for(var i= 0, tot=node.nodes.length; i<tot; i++) {
                    if (node.nodes[i].name === 'node') {
                        return node['open'] ? 'fa-toggle-down' : 'fa-toggle-right';
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
    .controller('detailController', function ($scope, $state) {
        $scope.$on('refreshDetail', function (event, data) {
            $scope.node = data.node;
        });
    });

