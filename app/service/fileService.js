/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.file.service', [
    'ngCookies'
])
.factory("FileApi", ['$rootScope', '$http', '$q', function ($rootScope, $http, $q)
    {
        function _list () {
            var deferred = $q.defer();
            $http.get("/file/files")
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (err){
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _load (id) {
            var deferred = $q.defer();
            $http.get("/file/file/"+id)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (err){
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _save(changes) {
            var deferred = $q.defer();
            // TODO: POST changes as JSON data
            $http.post("/file/change/"+id)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (err){
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _remove() {
        }

        return {
            list: _list,
            load: _load,
            save:   _save,
            remove: _remove
        };
    }]);