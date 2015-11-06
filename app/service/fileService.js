/**
 * Created by gpapp on 2015.05.15..
 */
angular.module('MindWebUi.file.service', [
        'ngCookies'
    ])
    .factory("FileService", ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
        function _list() {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.get("/file/files").
                    success(function (response) {
                        deferred.resolve(response);
                    }).
                    error(function (err) {
                        deferred.reject(err);
                    });
                },
                function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        function _listShared() {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.get("/file/sharedfiles").
                    success(function (response) {
                        deferred.resolve(response);
                    }).
                    error(function (err) {
                        deferred.reject(err);
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
                        deferred.reject(err);
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
                        deferred.reject(err);
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
                        deferred.reject(err);
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
                        $rootScope.$emit('updateFile', response);
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

        function _tagQuery(id, tag) {
            var defer = $q.defer();
            var authURL = '/file/tagQuery';
            $http.put(authURL, {id: id, query: tag}).then (
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
            var authURL = '/file/tag';
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
            var authURL = '/file/untag';
            $http.put(authURL, {id: id, tag: tag}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

        function _exportFreeplane(id) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.get('/file/convert/freeplane/' + id).
                    success(function (response) {
                        deferred.resolve(response);
                    }).
                    error(function (err) {
                        deferred.reject(err);
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

        function _delete(id) {
            var deferred = $q.defer();
            $rootScope.getCurrentUser().then(
                function () {
                    $http.delete('/file/file/' + id).
                    success(function (response) {
                        $rootScope.$emit('closeFile', response);
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

        return {
            list: _list,
            listShared: _listShared,
            load: _load,
            save: _save,
            create: _create,
            rename: _rename,
            tagQuery: _tagQuery,
            tag: _tag,
            untag: _untag,
            exportFreeplane: _exportFreeplane,
            exportODF: _exportODF,
            remove: _delete
        };
    }

    ]);