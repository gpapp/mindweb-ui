/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.file.service', [
        'ngCookies'
    ])
    .factory("FileApi", ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
        function _list() {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.get("/file/files").
                    success(function (response) {
                        deferred.resolve(response);
                    }).
                    error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _load(id) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.get("/file/file/" + id).
                    success(function (response) {
                        $rootScope.$emit('openFile', response.file);
                        deferred.resolve(response);
                    }).error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _save(id, changes) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.put('/file/change/' + id, {actions: changes}).
                    success(function (response) {
                        deferred.resolve({body: response.data, length: changes.length});
                    }).
                    error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _delete(id) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.delete('/file/file/' + id).
                    success(function (response) {
                        $rootScope.$emit('closeFile', response.data);
                        deferred.resolve();
                    }).
                    error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _create(name, isPublic, viewers, editors) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.post('/file/create', {
                        name: name,
                        isPublic: isPublic,
                        viewers: viewers,
                        editors: editors
                    }).
                    success(function (response) {
                        deferred.resolve();
                    }).
                    error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _rename(id, newName) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.post('/file/rename/' + id, {newName: newName}).
                    success(function (response) {
                        $rootScope.$emit('updateFile', response.data);
                    }).
                    error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _exportFreeplane(id) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.get('/file/convert/freeplane/' + id).
                    success(function (response) {
                        deferred.resolve(response.data);
                    }).
                    error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _exportODF(id) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.get('/file/convert/odf/' + id).
                    success(function (response) {
                        deferred.resolve(response.data);
                    }).
                    error(function (err) {
                        deferred.reject();
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        return {
            list: _list,
            load: _load,
            save: _save,
            rename: _rename,
            create: _create,
            remove: _delete,
            exportFreeplane: _exportFreeplane,
            exportODF: _exportODF
        };
    }

    ]);