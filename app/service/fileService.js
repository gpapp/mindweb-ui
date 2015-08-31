/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.file.service', [
    'ngCookies'
])
    .factory("FileApi", ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
        function _list() {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.get("/file/files")
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _load(id) {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.get("/file/file/" + id).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject();
                }
            );
            return deferred.promise;
        }

        function _save(id, changes) {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.put('/file/change/' + id, {actions: changes}).then(
                function (response) {
                    deferred.resolve({body: response.data, length: changes.length});
                },
                function (err) {
                    deferred.reject();
                }
            );

            return deferred.promise;
        }

        function _remove() {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
        }

        return {
            list: _list,
            load: _load,
            save: _save,
            remove: _remove
        };
    }]);