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

        FileApi.list().then(function (data) {
            $scope.files = data;
        });

        //$http.get("/storage/sharedfiles")
        //    .success(function (response) {
        //        $scope.sharedFiles = response;
        //    });
        var uploadMutex=false;
        $scope.$watch('uploadedFiles', function () {
            if (!uploadMutex){
                uploadMutex=true;
                $scope.upload($scope.uploadedFiles);
            }
        });

        $scope.upload = function (toUpload) {
            if (toUpload && toUpload.length) {
                for (var i = 0; i < toUpload.length; i++) {
                    var file = toUpload[i];
                    Upload.upload({
                        url: 'https://mindweb.itworks.hu/storage/file',
                        method: 'POST',
                        fields: {'username': $scope.username},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        FileApi.list().then(function (data) {
                            $scope.files = data;
                        });
                        uploadMutex=false;
                    }).error( function () {
                        uploadMutex=false;

                    })
                    ;

                }
            } else {
                uploadMutex=false;
            }
        };

        $scope.newFile = {};
        $scope.fileCreate = function (){

            //TODO add files creation call here
                    $scope.files.push(
                        {   fileName:$scope.newFile.fileName,
                            description: $scope.newFile.description,
                            version: 0,
                            creationDate: 'New',
                            modificationDate: 'New'
                        });
                    $state.go('files.list');

        };
    })
;