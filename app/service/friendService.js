/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.friend.service', [
        'ngCookies'
    ])
    .factory("FriendService", ['$rootScope', '$http', '$q', '$cookies', function ($rootScope, $http, $q, $cookies) {
        function _list() {
            var defer = $q.defer();
            var authURL = '/friend/list';
            $http.get(authURL).then (
                function (data) {
                    defer.resolve(data);
                },
                function () {
                    defer.reject();
                });
            return defer.promise;
        }

        function _load(id) {
            var defer = $q.defer();
            var authURL = '/friend/get';
            $http.put(authURL, {id: id}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

        function _create(alias, linkedUserId) {
            var defer = $q.defer();
            var authURL = '/friend/create';
            $http.put(authURL, {alias: alias, linkedUserId: linkedUserId}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

        function _update(id, alias, tags) {
            var defer = $q.defer();
            var authURL = '/friend/update';
            $http.put(authURL, {id: id, alias: alias, tags: tags}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

        function _tag(id, tag) {
            var defer = $q.defer();
            var authURL = '/friend/tag';
            $http.put(authURL, {id: id, tag: tag}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

        function _untag(id, tag) {
            var defer = $q.defer();
            var authURL = '/friend/untag';
            $http.put(authURL, {id: id, tag: tag}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

        function _remove(id, tag) {
            var defer = $q.defer();
            var authURL = '/friend/remove/' + id;
            $http.delete(authURL).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

        return {
            list: _list,
            load: _load,
            create: _create,
            update: _update,
            tag: _tag,
            untag: _untag,
            remove: _remove
        };
    }]);