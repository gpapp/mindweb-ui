angular.module('MindWebUi', [
    'MindWebUi.user',
    'MindWebUi.file',
    'MindWebUi.viewer',
    'ui.router',
    'mobile-angular-ui'
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

            $rootScope.$on("$routeChangeStart", function () {
                $rootScope.loading = true;
            });
            $rootScope.$on("$routeChangeSuccess", function () {
                $rootScope.loading = false;
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
