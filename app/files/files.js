angular.module('MindWebUi.file', [
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
    .controller('fileController', function ($rootScope, $scope, $http, $modal, $state, Upload, FileService) {
        $scope.loadingFiles = false;
        $scope.loadingSharedFiles = false;
        reloadFiles();

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
                    $scope.uploads[file.name] = {name: file.name, max: file.size, value: 0, done: false, error: false};
                    Upload.upload({
                        url: '/file/upload',
                        method: 'POST',
                        fields: {'username': $scope.username},
                        file: file
                    }).progress(function (evt) {
                        $scope.uploads[evt.config.file.name].value = evt.loaded;
                    }).success(function (data, status, headers, config) {
                        $scope.uploads[config.file.name].done = true;
                        $scope.uploads[config.file.name].error = status != 200;
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

        $scope.openCreateModal = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "file_create_modal.html",
                controller: "fileActionController",
                resolve: {
                    target: function () {
                        return {
                            name: '',
                            description: '',
                            version: 0,
                            creationDate: 'New',
                            modificationDate: 'New'
                        };
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                FileService.create(selectedItem.newName).then(function (data) {
                    $scope.files.push(data);
                });
            });
        };

        $scope.downloadFreeplane = function (target) {
            FileService.exportFreeplane(target.id).then(
                function (data) {
                    var blob = new Blob([data], {type: 'application/x-freemind'});
                    saveAs(blob, target.name);
                },
                function (error) {
                    alert("Cannot save file:" + error);
                }
            )
        };

        $scope.openShareModal = function (target) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "file_share_modal.html",
                controller: "fileActionController",
                resolve: {
                    target: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                FileService.share(
                    selectedItem.id,
                    selectedItem.newIsPublic,
                    selectedItem.newViewers,
                    selectedItem.newEditors).then(function (data) {
                    for (var i = 0; i < $scope.files.length; i++) {
                        if (data.id === $scope.files[i].id) {
                            $scope.files[i] = data;
                        }
                    }
                });
            });
        };
        $scope.openRenameModal = function (target) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "file_rename_modal.html",
                controller: "fileActionController",
                resolve: {
                    target: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                FileService.rename(selectedItem.id, selectedItem.newName).then(function (data) {
                    target.name = data.name;
                });
            });
        };
        $scope.openDeleteModal = function (target) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "file_delete_modal.html",
                controller: "fileActionController",
                resolve: {
                    target: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                FileService.remove(selectedItem.id).then(function () {
                    $scope.files.splice($scope.files.indexOf(target), 1);
                });
            });
        };

        $scope.loadTags = function (file, query) {
            return FileService.tagQuery(file.id, query);
        };

        $scope.tag = function (file, mytag) {
            FileService.tag(file.id, mytag.text).then(function (data) {
                file = data;
            });
        };

        $scope.untag = function (file, mytag) {
            FileService.untag(file.id, mytag.text).then(function (data) {
                file = data;
            });
        };

        $scope.fileOpen = function (file) {
            $state.go('viewer.file', {fileId: file.id});
        };

        $scope.fileClose = function (file) {
            $rootScope.$emit('closeFile', file);
        };

        // Utility functions for controller
        function reloadFiles() {
            $scope.loadingFiles = true;
            FileService.list().then(function (data) {
                    $scope.files = data;
                    $scope.loadingFiles = false;
                },
                function (data) {
                    $rootScope.$emit("$applicationError", "Cannot load file list");
                });
            $scope.loadingSharedFiles = true;
            FileService.listShared().then(function (data) {
                    $scope.sharedFiles = data;
                    $scope.loadingSharedFiles = false;
                },
                function () {
                    $rootScope.$emit("$applicationError", "Cannot load shared file list");
                });
        }
    })
    .controller('fileActionController', function ($scope, $modalInstance, target) {
        $scope.target = target;
        $scope.target.newName = $scope.target.name.replace(new RegExp("^(.*)\.mm$"), "$1");
        $scope.target.newIsPublic = $scope.target.isPublic;
        $scope.target.newViewers = $scope.target.viewers;
        $scope.target.newEditors = $scope.target.editors;

        $scope.ok = function () {
            $modalInstance.close($scope.target);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
