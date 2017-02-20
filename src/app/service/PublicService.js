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
var FileService_1 = require("./FileService");
var core_1 = require("@angular/core");
/**
 * Created by gpapp on 2015.05.15..
 */
var PublicService = (function () {
    function PublicService(http, fileService) {
        this.http = http;
    }
    PublicService.prototype.queryPublicTags = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("/public/fileTags/" + query).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                console.error(err);
                reject();
            });
        });
    };
    PublicService.prototype.listPublicFilesForTags = function (query, tags) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var headers = new http_1.Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            var body = JSON.stringify({ query: query, tags: tags });
            _this.http.post("/public/fileTags/", body, headers).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                console.error(err);
                reject();
            });
        });
    };
    PublicService.prototype.load = function (fileId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("/public/file/" + fileId).subscribe(function (data) {
                resolve(data.json());
            }, function (err) {
                console.error(err);
                reject();
            });
        });
    };
    return PublicService;
}());
PublicService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, FileService_1.FileService])
], PublicService);
exports.PublicService = PublicService;
//# sourceMappingURL=PublicService.js.map