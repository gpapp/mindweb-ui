angular.module('MindWebUi', [
        'MindWebUi.user',
        'MindWebUi.public',
        'MindWebUi.file',
        'MindWebUi.viewer',
        'MindWebUi.friends',
        'ui.router',
        'mobile-angular-ui',
        'mobile-angular-ui.gestures'
    ])
    .run(
        ['$rootScope', '$q', 'UsersApi',
            function ($rootScope, $q, UsersApi) {
                $rootScope.openFiles = [];

                $rootScope.$on("$routeChangeStart", function () {
                    $rootScope.loading = true;
                });
                $rootScope.$on("$routeChangeSuccess", function () {
                    $rootScope.loading = false;
                });
                $rootScope.$on("$applicationError", function (msg) {
                    $rootScope.error = true;
                    $rootScope.errorMsg = msg;
                    setTimeout(function(){
                        $rootScope.error = false;
                        $rootScope.errorMsg = '';
                    },1000);
                });

                /// When a file information changes, update the file (rename)
                $rootScope.$on("updateFile", function (event, file) {
                    for (var index = 0, length = $rootScope.openFiles.length; index < length; index++) {
                        if (file.id === $rootScope.openFiles[index]['id']) {
                            $rootScope.openFiles[index] = file;
                            return;
                        }
                    }
                });

                /// When a file is opened, update the filelist (open,load with URL)
                $rootScope.$on("openFile", function (event, file) {
                    for (var index = 0, length = $rootScope.openFiles.length; index < length; index++) {
                        if (file.id === $rootScope.openFiles[index]['id']) {
                            return;
                        }
                    }
                    $rootScope.openFiles.push(file);
                });

                /// When a file is closed, update the filelist (close,delete)
                $rootScope.$on("closeFile", function (event, file) {
                    for (var index = 0, length = $rootScope.openFiles.length; index < length; index++) {
                        if (file['id'] === $rootScope.openFiles[index]['id']) {
                            $rootScope.openFiles.splice(index, 1)
                        }
                    }
                });

                $rootScope.getCurrentUser = function () {
                    var deferred = $q.defer();
                    if ($rootScope.currentUser) {
                        deferred.resolve($rootScope.currentUser);
                        return deferred.promise;
                    }
                    UsersApi.lookup().then(
                        function (user) {
                            $rootScope.currentUser = user.data;
                            deferred.resolve(user);
                        },
                        function () {
                            delete $rootScope.currentUser;
                            deferred.reject();
                        });
                    return deferred.promise;
                }

                $rootScope.getCurrentUser().then(function (data) {
                    console.log(data);
                });
            }
        ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '',
                templateUrl: 'app/home.html',
                data: {
                    requireLogin: false
                }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'app/about.html',
                data: {
                    requireLogin: false
                }
            })
            .state('login', {
                url: '/login',
                controller: 'loginController'
            })
    })
;
