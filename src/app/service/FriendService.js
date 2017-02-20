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
var FriendService = (function () {
    function FriendService(http, userService) {
        this.http = http;
        this.userService = userService;
        this.friends = [];
    }
    FriendService.prototype.list = function () {
        var _this = this;
        this.userService.lookup().then(function () {
            _this.http.get("/friend/list").subscribe(function (data) { return _this.friends = data.json(); }, function (err) { return console.error(err); });
        });
        return this.friends;
    };
    FriendService.prototype.load = function (id, newName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                _this.http.get("/friend/get/" + id).subscribe(function (data) {
                    //todo: Close files in rootscope
                    resolve(data.json());
                }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    FriendService.prototype.create = function (alias, linkedUserId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userService.lookup().then(function () {
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var body = JSON.stringify({ alias: alias, linkedUserId: linkedUserId });
                _this.http.post("/friend/create", body, headers).subscribe(function (data) {
                    //todo: Close files in rootscope
                    resolve(data.json());
                }, function (err) {
                    console.error(err);
                    reject();
                });
            });
        });
    };
    return FriendService;
}());
FriendService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, UserService_1.UserService])
], FriendService);
exports.FriendService = FriendService;
/**

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

 **/ 
//# sourceMappingURL=FriendService.js.map