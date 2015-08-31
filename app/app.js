angular.module('MindWebUi', [
    'MindWebUi.user',
    'MindWebUi.file',
    'MindWebUi.viewer',
    'ui.router',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures'
])
    .run(
    ['$rootScope', '$state', '$stateParams', 'UsersApi',
        function ($rootScope, $state, $stateParams, UsersApi) {
            $rootScope.openFiles = [];

            $rootScope.$on("$routeChangeStart", function () {
                $rootScope.loading = true;
            });
            $rootScope.$on("$routeChangeSuccess", function () {
                $rootScope.loading = false;
            });

            $rootScope.$on("openFile", function (event, file) {
                for (var index = 0, length = $rootScope.openFiles.length; index < length; index++) {
                    if (file.id === $rootScope.openFiles[index]['id']) {
                        return;
                    }
                }
                $rootScope.openFiles.push(file);
            });

            $rootScope.$on("closeFile", function (event, file) {
                for (var index = 0, length = $rootScope.openFiles.length; index < length; index++) {
                    if (file['id'] === $rootScope.openFiles[index]['id']) {
                        $rootScope.openFiles.splice(index, 1)
                    }
                }
            });

            UsersApi.lookup().then(function (user) {
                $rootScope.currentUser = user;
            }, function () {
                delete $rootScope.currentUser;
            }, function () {
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
