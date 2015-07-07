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
        function ($rootScope, $state, $stateParams,UsersApi) {
            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.openFiles = [];

            $rootScope.$on("$routeChangeStart", function () {
                $rootScope.loading = true;
            });
            $rootScope.$on("$routeChangeSuccess", function () {
                $rootScope.loading = false;
            });

            $rootScope.$on("openFile", function (event, file) {
                for (var index in $rootScope.openFiles) {
                    if (file.id === $rootScope.openFiles[index].id) {
                        return;
                    }
                }
                $rootScope.openFiles.push(file);
            });

            $rootScope.$on("closeFile", function (event, file) {
                for (var index in $rootScope.openFiles){
                    if (file.id === $rootScope.openFiles[index].id) {
                        $rootScope.openFiles.splice(index,1)
                    }
                }
            });

            UsersApi.lookup().then(function (user) {
                $rootScope.currentUser = user;
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
                templateUrl: 'app/about.html'
            })
            .state('login', {
                url: '/login',
                controller: 'loginController'
            })
    })
;
