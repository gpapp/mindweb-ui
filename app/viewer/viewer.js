angular.module('MindWebUi.viewer', [
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
                    url: '/{fileId:[0-9]{1,8}}',
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
    .controller('structureController', function ($scope, $rootScope, $state) {
        $scope.nodes =
        {
            id: 0, text: 'item root', content: 'jadajada', open: true, link: '', nodes: [
            {id: 1, text: 'item 1', content: 'jadajada', open: false, link: ''},
            {
                id: 2, text: 'item 2', content: 'lorem', open: false, link: '', nodes: [
                {id: 21, text: 'item 2-1', content: 'jadajada', open: false, link: ''},
                {id: 22, text: 'item 2-2', content: 'lorem', open: false, link: ''},
                {id: 23, text: 'item 2-3', content: 'ipsum', open: false, link: ''},
                {id: 24, text: 'item 2-4', content: 'dolor', open: false, link: ''}
            ]
            },
            {id: 3, text: 'item 3', content: 'ipsum', open: false, link: ''},
            {id: 4, text: 'item 4', content: 'dolor', open: false, link: ''},
        ]
        };
        $scope.nodeIcon = function (node) {
            return node['open'] ? 'fa-toggle-down' : 'fa-toggle-right';
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