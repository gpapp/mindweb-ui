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
        $scope.loadingTags = false;
        $scope.loadingFiles = false;
        $scope.tagsearch = '';
        $scope.filesearch = '';

        $scope.selectedTags = [];
        reloadFiles();
        reloadTags();

        $scope.reloadTags = function () {
            reloadTags();
        };

        $scope.reloadFiles = function () {
            reloadFiles();
        };

        $scope.selectTag = function (tag) {
            $scope.selectedTags.push(tag);
            $scope.selectedTags = $scope.selectedTags.filter(function (v, i, a) {
                return a.indexOf(v) === i;
            })
            reloadFiles();
        };

        $scope.removeSelected = function (tag) {
            $scope.selectedTags = $scope.selectedTags.filter(function (v) {
                return !(v === tag);
            });
            reloadFiles();
        };

        $scope.clearSelection = function () {
            $scope.selectedTags = [];
        };

        $scope.fileOpen = function (file) {
            $state.go('viewer.file', {fileId: file.id});
        };

        // Utility functions for controller
        function reloadTags() {
            $scope.loadingTags = true;
            FileService.listPublicTags($scope.tagsearch).then(function (data) {
                    $scope.publicTags = data;
                    $scope.loadingTags = false;
                },
                function (data) {
                    $rootScope.$emit("$applicationError", "Cannot load tag list");
                });
        }

        function reloadFiles() {
            $scope.loadingFiles = true;
            FileService.listPublicFilesForTags($scope.filesearch, $scope.selectedTags).then(function (data) {
                    $scope.files = data;
                    $scope.loadingFiles = false;
                },
                function (data) {
                    $rootScope.$emit("$applicationError", "Cannot load file list");
                });
        }
    });

