angular.module('MindWebUi.viewer', [
    'MindWebUi.file.service',
    'ui.router',
    'angular-markdown',
    'ui.bootstrap.tabs',
    'mobile-angular-ui.gestures',
    'ui.tree'
])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider) {
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
    .controller('viewerController', function ($scope) {
        $scope.$on('selectNode', function (event, data) {
            $scope.currentNode = data.node;
            event.stopPropagation();
        });
    })
    .controller('structureController', function ($scope, $rootScope, $state, $filter, FileApi) {

        $rootScope.loading = true;

        FileApi.load($state.params.fileId).then(function (data) {
            $scope.nodes = JSON.parse(data.content);
            $scope.nodes.open = true;
            $rootScope.loading = false;
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
        $scope.refreshDetail = function (node) {
            $scope.$emit('selectNode', {node: node});
        };

    }
)
    .controller('detailController', function ($scope) {


    });
