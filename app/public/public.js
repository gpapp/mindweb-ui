angular.module('MindWebUi.public', [
        'MindWebUi.file.service',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router',
        'ngFileUpload',
        'ngTagsInput'
    ])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('public', {
                    abstract: true,
                    url: '/public',
                    template: '<section ui-view></section>',
                    data: {
                        requireLogin: false // this property will apply to all children of 'app'
                    }
                })
                .state('public.tags', {
                    url: '',
                    templateUrl: 'app/public/public.html',
                    controller: 'publicController'
                })
        }
    ])
    .controller('publicController', function ($scope, $rootScope, $state, $filter, $window, FileService) {

    });

