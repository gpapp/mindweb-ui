angular.module('MindWebUi.file', [
    'MindWebUi.file.service',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.router',
    'ngFileUpload'
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('files', {
                    abstract: true,
                    url: '/files',
                    template: '<section ui-view></section>',
                    data: {
                        requireLogin: true // this property will apply to all children of 'app'
                    }
                })
                .state('files.list', {
                    url: '',
                    templateUrl: 'app/files/files.html',
                    controller: 'fileController'
                })
        }
    ])
    .controller('fileController', function ($rootScope, $scope, $http, $modal, $state, Upload, FileApi) {

        reloadFiles($scope);

        //$http.get("/storage/sharedfiles")
        //    .success(function (response) {
        //        $scope.sharedFiles = response;
        //    });
        var uploadMutex = false;
        $scope.$watch('uploadedFiles', function () {
            if (!uploadMutex) {
                uploadMutex = true;
                $scope.upload($scope.uploadedFiles);
            }
        });
        $scope.uploads = {};
        $scope.upload = function (toUpload) {
            if (toUpload && toUpload.length) {
                for (var i = 0; i < toUpload.length; i++) {
                    var file = toUpload[i];
                    $scope.uploads[file.name]={name:file.name, max:file.size, value:0, done:false, error:false};
                    Upload.upload({
                        url: '/file/upload',
                        method: 'POST',
                        fields: {'username': $scope.username},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.uploads[evt.config.file.name].value=evt.loaded;
                    }).success(function (data, status, headers, config) {
                        $scope.uploads[config.file.name].done = true;
                        $scope.uploads[config.file.name].error = status!=200;
                        reloadFiles();
                        uploadMutex = false;
                    }).error(function (data, status, headers, config) {
                        $scope.uploads[config.file.name].error = true;
                        $scope.uploads[config.file.name].errorMsg = 'ERROR';
                        uploadMutex = false;
                    })
                    ;
                }
            } else {
                uploadMutex = false;
            }
        };

        $scope.rename = function (toRename) {

        };

        $scope.delete = function (toDelete) {

        };

        $scope.newFile = {};
        $scope.fileCreate = function () {

            //TODO add files creation call here
            $scope.files.push(
                {
                    fileName: $scope.newFile.fileName,
                    description: $scope.newFile.description,
                    version: 0,
                    creationDate: 'New',
                    modificationDate: 'New'
                });
            $state.go('files.list');

        };

        // Utility functions for controller
        function reloadFiles() {
            $rootScope.$emit('$routeChangeStart');
            FileApi.list().then(function (data) {
                $scope.files = data;
                $rootScope.$emit('$routeChangeSuccess');
            });
        }
    });
