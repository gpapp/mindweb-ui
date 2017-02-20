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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var FileService_1 = require("../service/FileService");
var TemplateComponent_1 = require("./TemplateComponent");
/**
 * Created by gpapp on 2017.02.19..
 */
var SidebarComponent = (function () {
    function SidebarComponent(fileService, parent) {
        this.fileService = fileService;
        this.parent = parent;
    }
    Object.defineProperty(SidebarComponent.prototype, "openFiles", {
        get: function () {
            return this.fileService.openFiles.entries();
        },
        enumerable: true,
        configurable: true
    });
    return SidebarComponent;
}());
SidebarComponent = __decorate([
    core_1.Component({
        providers: [FileService_1.FileService],
        selector: 'sidebar',
        templateUrl: '/app/layout/sidebar.html'
    }),
    __param(1, core_1.Host()),
    __metadata("design:paramtypes", [FileService_1.FileService, TemplateComponent_1.TemplateComponent])
], SidebarComponent);
exports.SidebarComponent = SidebarComponent;
//# sourceMappingURL=SidebarComponent.js.map