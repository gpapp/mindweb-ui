/*

 angular.module('MindWebUi.public', [
 '
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
                .state('public.display', {
                    url: '/display',
                    templateUrl: 'app/public/public.html',
                    controller: 'publicController',
                    data: {
                        display: true
                    }
                })
        }
 ])
 .controller('publicController', function ($scope, $rootScope, $state, $filter, $uibModal, $window, PublicService) {
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
            });
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

        $scope.openDisplayModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'freeplane_view_modal.html',
                controller: 'displayUploadController',
                self: modalInstance
            });
        };

        if ($state.$current.data.display) {
            $scope.openDisplayModal();
        }

        // Utility functions for controller
        function reloadTags() {
            $scope.loadingTags = true;
            PublicService.listPublicTags($scope.tagsearch).then(function (data) {
                    $scope.publicTags = data;
                    $scope.loadingTags = false;
                },
                function (data) {
                    $rootScope.$emit('$applicationError', 'Cannot load tag list');
                });
        }

        function reloadFiles() {
            $scope.loadingFiles = true;
            PublicService.listPublicFilesForTags($scope.filesearch, $scope.selectedTags).then(function (data) {
                    $scope.maps = data;
                    $scope.loadingFiles = false;
                },
                function (data) {
                    $rootScope.$emit('$applicationError', 'Cannot load file list');
                });
        }
    }).controller('displayUploadController', function ($scope, $state, Upload, FileService) {
        var uploadMutex = false;
        $scope.$watch('uploadedFiles', function () {
            if (!uploadMutex) {
                uploadMutex = true;
                $scope.upload($scope.uploadedFiles);
            }
        });
        $scope.uploads = {};
        $scope.upload = function (toUpload) {
            if (toUpload) {
                $scope.uploads[toUpload.name] = {name: toUpload.name, max: toUpload.size, value: 0, done: false, error: false};
                Upload.upload({
                    url: '/public/display',
                    method: 'POST',
                    fields: {'username': $scope.username},
                    file: toUpload
                }).progress(function (evt) {
                    $scope.uploads[evt.config.file.name].value = evt.loaded;
                }).success(function (data, status, headers, config) {
                    $scope.uploads[config.file.name].done = true;
                    $scope.uploads[config.file.name].error = status != 200;
                    $scope.$close();
                    $state.go('viewer.display',{fileContent:data},{location:false});
                    uploadMutex = false;
                }).error(function (data, status, headers, config) {
                    $scope.uploads[config.file.name].error = true;
                    $scope.uploads[config.file.name].errorMsg = 'ERROR';
                    uploadMutex = false;
                })
                ;
            } else {
                uploadMutex = false;
            }
        };
    }
 );

 *
 */