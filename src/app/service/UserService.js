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
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
/**
 * Created by gpapp on 2015.05.15..
 */
var UserService = UserService_1 = (function () {
    function UserService(http) {
        this.http = http;
        this._authenticationDone = false;
    }
    UserService.prototype.lookup = function () {
        var _this = this;
        if (this._authenticationDone) {
            return new Promise(function (resolve) {
                resolve(_this._authenticationDone);
            });
        }
        return this.http.get(UserService_1.authURL).map(function (res) {
            _this._authenticationDone = true;
            return res.json();
        }).toPromise().catch(function (error) {
            _this._authenticationDone = true;
            return error;
        });
    };
    UserService.prototype.logout = function () {
        this._authenticationDone = true;
        delete this._currentUser;
        return this.http.get(UserService_1.logoutURL).map(function (res) { return res.json(); }).toPromise().catch(this.handleError);
    };
    UserService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            errMsg = error.status + " - " + (error.statusText || '') + " " + error.text();
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    return UserService;
}());
UserService.authURL = '/auth/authenticated';
UserService.logoutURL = '/auth/logout';
UserService = UserService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
var UserService_1;
//# sourceMappingURL=UserService.js.map