app.config(function ($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            data: {
                requireLogin: false
            }
        })
        .state('user', {
            abstract: true,
            url: '/user',
            data: {
                requireLogin: false
                //    requireLogin: true // this property will apply to all children of 'app'
            }
        })
        .state('user/files', {
            url: '/user/files',
            templateUrl: 'views/files.html',
            data: {
                requireLogin: true // this property will apply to all children of 'app'
            }
        })
        .state('user/options', {
            url: '/user/options',
            templateUrl: 'views/options.html',
            data: {
                requireLogin: true // this property will apply to all children of 'app'
            }
        })
        .state('about', {
            url: '/about',
            templateUrl: 'views/about.html'
        })
        .state('user/logout', {
            url: '/user/logout',
            templateUrl: 'views/home.html',
            data: {
                requireLogin: true // this property will apply to all children of 'app'
            }
        })
});
