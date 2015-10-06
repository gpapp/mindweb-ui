/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.user.service', [
        'ngCookies'
    ])
    .factory("UsersApi", ['$rootScope', '$http', '$q', '$cookies', function ($rootScope, $http, $q, $cookies) {
        function _lookup() {
            var defer = $q.defer();
            var authURL = '/auth/authenticated';
            $http.get(authURL).then (
                function (data) {
                    defer.resolve(data);
                },
                function () {
                    defer.reject();
                });
            return defer.promise;
        }

        function _logout() {
            var authURL = '/auth/logout';
            $http.get(authURL).then (
                function (data) {
                    console.log('Logout done');
                },
                function (error) {
                    console.error('Logout error', error);
                });
            $cookies.remove('mindweb_session');
        }

        return {
            lookup: _lookup,
            logout: _logout
        };
    }]);