angular.module('MindWebUi.user', [
    'MindWebUi.user.service',
    'ngFileUpload',
    'ui.router'
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('user', {
                    abstract: true,
                    url: '/user',
                    template: '<section ui-view></section>',
                    data: {
                        requireLogin: true // this property will apply to all children of 'app'
                    }
                })
                .state('user.files', {
                    url: '/files',
                    templateUrl: 'app/user/files.html',
                    controller: 'fileController'
                })
                .state('user.options', {
                    url: '/options',
                    templateUrl: 'app/user/options.html'
                })
                .state('user.login', {
                    url: '/login',
                    controller: function ($state, $modal) {
                        var instance = $modal.open({
                            templateUrl: 'app/login/loginModal.html',
                            controller: 'LoginModalCtrl',
                            controllerAs: 'LoginModalCtrl',
                            size: 'md'
                        })
                            .then(function () {
                                $state.go('user.files')
                            });
                    }
                })
                .state('user.logout', {
                    url: '/logout',
                    controller: function ($state, $rootScope, UsersApi) {
                        delete $rootScope.currentUser;
                        UsersApi.logout();
                        $state.go('home');
                    }
                });
        }
    ])
    .controller('fileController', function ($rootScope, $scope, $http, $modal, $state, Upload) {
        $http.get("/storage/files")
            .success(function (response) {
                $scope.files = response;
            });

        //$http.get("/storage/sharedfiles")
        //    .success(function (response) {
        //        $scope.sharedFiles = response;
        //    });

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
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
                    });
                }
            }
        };

        $scope.fileCreate = function () {
            var instance = $modal.open(
                {
                    templateUrl: 'app/user/fileCreateModal.html',
                    size: 'md',
                    controller: 'fileCreateController'
                });
            instance.result
                .then(function (result) {
                    //TODO add file creation call here
                    $scope.files.push(result);
                    $state.go('user.files');
                });
        }
    })
    .controller('fileCreateController', function ($rootScope, $scope, $modalInstance, $http) {
        $scope.fileName;
        $scope.fileDescription;

        $scope.submit = function () {
            $modalInstance.close({fileName:$scope.fileName, description:$scope.fileDescription});
        };
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    })
;