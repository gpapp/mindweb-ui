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
var core_1 = require("@angular/core");
var UploadService_1 = require("../service/UploadService");
var FilesComponent_1 = require("./FilesComponent");
var UploadComponent = (function () {
    function UploadComponent(service, parent) {
        this.service = service;
        this.parent = parent;
        this.service.progress.subscribe(function (data) {
            console.log('progress = ' + data);
        });
    }
    UploadComponent.prototype.onChange = function (event) {
        var _this = this;
        console.log('onChange');
        var files = event.srcElement.files;
        console.log(files);
        this.service.makeFileRequest("/file/upload", files).subscribe(function () {
            console.log('sent');
            _this.parent.refreshFiles();
        });
    };
    return UploadComponent;
}());
UploadComponent = __decorate([
    core_1.Component({
        selector: 'file-upload',
        template: "\n\t  <div>\n\t    <input type=\"file\"  accept=\".mm\" (change)=\"onChange($event)\"/>\n\t  </div>\n\t",
        providers: [UploadService_1.UploadService]
    }),
    __metadata("design:paramtypes", [UploadService_1.UploadService, FilesComponent_1.FilesComponent])
], UploadComponent);
exports.UploadComponent = UploadComponent;
//# sourceMappingURL=UploadComponent.js.map