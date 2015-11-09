/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.public.service', [
        'ngCookies'
    ])
    .factory("PublicService", ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

        function _listPublicTags(query) {
            var deferred = $q.defer();
            
            $http.get("/public/fileTags/" + query).
            success(function (response) {
                deferred.resolve(response);
            }).
            error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _listPublicFilesForTags(query, tags) {
            var deferred = $q.defer();
            $http.put("/public/filesForTags", {query: query, tags: tags}).
            success(function (response) {
                deferred.resolve(response);
            }).
            error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function _load(id) {
            var deferred = $q.defer();
            $http.get("/public/file/" + id).
            success(function (response) {
                $rootScope.$emit('openFile', response.file);
                deferred.resolve(response);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        return {
            listPublicTags: _listPublicTags,
            listPublicFilesForTags: _listPublicFilesForTags,
            load: _load
        };
    }

    ]);