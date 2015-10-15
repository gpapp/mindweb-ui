angular.module('MindWebUi.friends', [
        'MindWebUi.file.service',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router',
        'ngFileUpload'
    ])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('friends', {
                    abstract: true,
                    url: '/friends',
                    template: '<section ui-view></section>',
                    data: {
                        requireLogin: true // this property will apply to all children of 'app'
                    }
                })
                .state('friends.list', {
                    url: '',
                    templateUrl: 'app/friends/friends.html',
                    controller: 'friendController'
                })
        }
    ])
    .controller('friendController', function ($rootScope, $scope, $http, $modal, $state, Upload, FileService) {


    });