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
Object.defineProperty(exports, "__esModule", { value: true });
var FileService_1 = require("./FileService");
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
/**
 * Created by gpapp on 2015.05.15..
 */
var TaskService = (function () {
    function TaskService(http, fileService) {
        this.http = http;
        this.fileService = fileService;
    }
    TaskService.prototype.parseTasks = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("/task/parse/" + id).subscribe(function (data) { return resolve(data.json()); }, function (err) {
                console.error(err);
                reject();
            });
        });
    };
    return TaskService;
}());
TaskService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, FileService_1.FileService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map