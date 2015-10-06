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
                    $rootScope.$emit('openFile', response.data.file);
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

        function _delete(id) {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.delete('/file/file/' + id).then(
                function (response) {
                    $rootScope.$emit('closeFile', response.data);
                    deferred.resolve();
                },
                function (err) {
                    deferred.reject();
                }
            );

            return deferred.promise;
        }

        function _create(name, isPublic, viewers, editors) {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.post('/file/create', {name: name, isPublic: isPublic, viewers: viewers, editors: editors}).then(
                function (response) {
                    deferred.resolve();
                },
                function (err) {
                    deferred.reject();
                }
            );

            return deferred.promise;
        }

        function _rename(id, newName) {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.post('/file/rename/' + id, {newName: newName}).then(
                function (response) {
                    $rootScope.$emit('updateFile', response.data);
                    deferred.resolve();
                },
                function (err) {
                    deferred.reject();
                }
            );
            return deferred.promise;
        }

        function _exportFreeplane(id) {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.get('/file/convert/freeplane/' + id).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject();
                }
            );
            return deferred.promise;
        }

        function _exportODF(id) {
            var deferred = $q.defer();
            if (!$rootScope.currentUser) {
                deferred.reject();
                return deferred.promise;
            }
            $http.get('/file/convert/odf/' + id).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject();
                }
            );
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
    }]);