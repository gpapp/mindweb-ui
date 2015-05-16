app.controller('homeController', function ($rootScope, $scope) {

    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.loading = false;
    });

    $scope.userAgent = navigator.userAgent;

});
