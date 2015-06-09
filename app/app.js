angular.module('MindWebUi', [
    'MindWebUi.login',
    'MindWebUi.user',
    'MindWebUi.viewer',
    'ui.router',
    'mobile-angular-ui'
])

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
            var loginModal, $http, $state;

            // this trick must be done so that we don't receive
            // `Uncaught Error: [$injector:cdep] Circular dependency found`
            $timeout(function () {
                loginModal = $injector.get('loginModal');
                $http = $injector.get('$http');
                $state = $injector.get('$state');
            });

            return {
                responseError: function (rejection) {
                    if (rejection.status !== 401) {
                        return rejection;
                    }

                    var deferred = $q.defer();

                    loginModal()
                        .then(function () {
                            deferred.resolve($http(rejection.config));
                        })
                        .catch(function () {
                            $state.go('home');
                            deferred.reject(rejection);
                        });

                    return deferred.promise;
                }
            };
        });
    })

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

    .run(function ($rootScope, $state, loginModal) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = angular.isDefined(toState.data) && angular.isDefined(toState.data.requireLogin) && toState.data.requireLogin;

            if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
                event.preventDefault();

                loginModal()
                    .then(function () {
                        return $state.go(toState.name, toParams);
                    })
                    .catch(function () {
                        return $state.go('home');
                    });
            }
        });
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/home.html',
                data: {
                    requireLogin: false
                }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'app/about.html'
            })
    });

