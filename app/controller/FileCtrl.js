app.controller('fileController', function ($rootScope, $scope, $http) {
    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.loading = false;
    });

    $http.get("http://www.w3schools.com/angular/customers.php")
        .success(function (response) {
            $scope.names = response.records;
        });

    $scope.recentFiles = [{id: '2', fileName: '2.mm', date: '2015-05-10'},
        {id: '1', fileName: '1.mm', date: '2015-05-15'}];

    $scope.allFiles = [{id: '1', fileName: '1.mm', date: '2015-05-15'},
        {id: '5', fileName: '5.mm', date: '2015-05-15'},
        {id: '3', fileName: '3.mm', date: '2015-05-15'},
        {id: '4', fileName: '4.mm', date: '2015-05-15'},
        {id: '2', fileName: '2.mm', date: '2015-05-15'},
        {id: '6', fileName: '6.mm', date: '2015-05-15'}];

    $scope.sharedFiles =
        [{id: 's1', fileName: 's1.mm', date: '2015-05-15'},
            {id: '5', fileName: 's2.mm', date: '2015-05-15'}];
});
