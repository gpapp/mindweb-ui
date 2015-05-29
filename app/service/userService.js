/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.user.service', [
    'ngCookies'
])
.factory("UsersApi", ['$rootScope', '$http', '$q', '$cookies', function ($rootScope, $http, $q, $cookies) {
    function _lookup () {
        var defer = $q.defer();
        var cookie = $cookies.get('mindweb_session');
        if (angular.isUndefined(cookie)) {
            defer.reject();
        } else {
            setTimeout(function () {
                var authURL = $rootScope.brokerURL+'/authenticate/'+cookie;
                $http.get(authURL)
                    .success (function (data,b,c,d) {
                    defer.resolve(data);
                })
                    .error (function (data,b,c,d) {
                    defer.reject();
                });
            }, 100);
        }
        return defer.promise;
    }

    function _login(email, password) {
        var d = $q.defer();
        setTimeout(function () {
            var authURL = $rootScope.brokerURL+'/authenticate/'+email;
            $http.get(authURL)
            .success (function (data) {
                $cookies.put('mindweb_session',data.sessionId);
                d.resolve(data);
            })
            .error (function (data) {
                d.reject();
            });
        }, 100);
        return d.promise;
    }

    function _logout() {
        $cookies.remove('mindweb_session');
    }

    return {
        lookup: _lookup,
        logout: _logout,
        login: _login
    };
}]);