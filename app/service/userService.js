/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.user.service', [
    'ngCookies'
])
.factory("UsersApi", ['$rootScope', '$http', '$q', '$cookies', function ($rootScope, $http, $q, $cookies) {
    function _lookup () {
        var defer = $q.defer();
        setTimeout(function () {
            var authURL = '/session/authenticated';
            $http.get(authURL)
                .success (function (data,b,c,d) {
                defer.resolve(data);
            })
                .error (function (data,b,c,d) {
                defer.reject();
            });
        }, 100);
        return defer.promise;
    }

    function _logout() {
        var authURL = '/session/logout';
        $http.get(authURL).success (
            function (data)
            {
                console.log('Logout done');
            })
            .error (function (error) {
                console.error('Logout error',error);
        });
        $cookies.remove('mindweb_session');
    }

    return {
        lookup: _lookup,
        logout: _logout
    };
}]);