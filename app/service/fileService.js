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
            $http.get("/storage/files")
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
            $http.get("/storage/file/"+id)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (err){
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _save() {
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