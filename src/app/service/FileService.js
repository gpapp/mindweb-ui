"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require("@angular/http");
var UserService_1 = require("./UserService");
var core_1 = require("@angular/core");
/**
 * Created by gpapp on 2015.05.15..
 */
var FileService = (function () {
    function FileService(http, userService) {
        this.http = http;
        this.userService = userService;
        this.files = [];
        this.sharedFiles = [];
        this._openFiles = new Map();
    }
    Object.defineProperty(FileService.prototype, "openFiles", {
        get: function () {
            return this._openFiles;
        },
        enumerable: true,
        configurable: true
    });
    FileService.prototype.list = function () {
        var _this = this;
        this.userService.lookup().then(function () {
            _this.http.get("/file/files").subscribe(function (data) { return _this.files = data.json(); }, function (err) { return console.error(err); });
        });
        return this.files;
    };
    FileService.prototype.listShared = function () {
        var _this = this;
        this.userService.lookup().then(function () {
            _this.http.get("/file/sharedFiles").subscribe(function (data) { return _this.sharedFiles = data.json(); }, function (err) { return console.error(err); });
        });
        return this.sharedFiles;
    };
    FileService.prototype.create = function (name, isShareable, isPublic, viewers, editors) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var body = JSON.stringify({
                    name: name,
                    isShareable: isShareable,
                    isPublic: isPublic,
                    viewers: viewers,
                    editors: editors
                });
                _this.http.post("/file/create", body, headers).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FileService.prototype.share = function (fileId, isShareable, isPublic, viewers, editors) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var body = JSON.stringify({
                    name: name,
                    isShareable: isShareable,
                    isPublic: isPublic,
                    viewers: viewers,
                    editors: editors
                });
                _this.http.post("/file/share", body, headers).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FileService.prototype.rename = function (id, newName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var body = JSON.stringify({ newName: newName });
                _this.http.post("/file/rename/" + id, body, headers).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FileService.prototype.delete = function (fileId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                _this.http.delete("/file/file/" + fileId).subscribe(function (data) {
                    _this.unRegisterFile(fileId);
                    resolve(data.json());
                }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FileService.prototype.tagQuery = function (id, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var body = JSON.stringify({ id: id, query: query });
                _this.http.post("/file/tagQuery", body, headers).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FileService.prototype.tag = function (id, tag) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var body = JSON.stringify({ id: id, tag: tag });
                _this.http.post("/file/tag", body, headers).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FileService.prototype.exportFreeplane = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                _this.http.get('/file/convert/freeplane/' + id).subscribe(function (data) { return resolve(data); }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FileService.prototype.registerFile = function (file) {
        this._openFiles.set(file.id, file);
    };
    FileService.prototype.unRegisterFile = function (fileId) {
        this._openFiles.delete(fileId);
    };
    return FileService;
}());
FileService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, UserService_1.UserService])
], FileService);
exports.FileService = FileService;
/*

 private _save(id, changes) {
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


 };*/ 
//# sourceMappingURL=FileService.js.map