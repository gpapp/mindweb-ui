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
                        requireLogin: true
                    }
                })
                .state('viewer.file', {
                    url: '/{fileId:[0-9]{1,8}}',
                    views: {
                        '': {
                            templateUrl: 'app/viewer/file.html'
                        },
                        'detail@viewer': {
                            templateUrl: 'app/viewer/detail.html'
                        }
                    }
                });
        }
    ]);