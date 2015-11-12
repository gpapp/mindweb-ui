/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.task.service', [
        'ngCookies'
    ])
    .factory("TaskService", ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

        function _parseTasks(id) {
            var deferred = $q.defer();
            $http.get("/task/parse/" + id).
            success(function (response) {
                $rootScope.$emit('openFile', response.file);
                deferred.resolve(response);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        return {
            parseTasks: _parseTasks
        };
    }

    ]);