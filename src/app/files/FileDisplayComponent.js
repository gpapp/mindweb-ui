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
var File_1 = require("mindweb-request-classes/dist/classes/File");
var FilesComponent_1 = require("./FilesComponent");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var FileService_1 = require("../service/FileService");
var TemplateComponent_1 = require("../layout/TemplateComponent");
var FileDisplayComponent = (function () {
    function FileDisplayComponent(fileService, modalService, root, parent) {
        this.fileService = fileService;
        this.modalService = modalService;
        this.root = root;
        this.parent = parent;
        this.infoPopup = false;
        this.hovered = false;
    }
    FileDisplayComponent.prototype.exportFreeplane = function () {
        var name = this.item.name;
        this.fileService.exportFreeplane(this.item.id.toString()).then(function (data) {
            var blob = new Blob([data.text()], { type: 'application/x-freemind' });
            var url = window.URL.createObjectURL(blob, { oneTimeOnly: true });
            var tempLink = document.createElement('a');
            document.body.appendChild(tempLink);
            tempLink.href = url;
            tempLink.setAttribute('download', name);
            tempLink.click();
            document.body.removeChild(tempLink);
        }, function (error) {
            alert("Cannot save file:" + error);
        });
    };
    FileDisplayComponent.prototype.open = function (command, dialog) {
        var _this = this;
        this.parent.target = this.item;
        this.modalService.open(dialog, { size: 'lg' }).result.then(function (result) {
            var promise;
            switch (command) {
                case 'share':
                    promise = _this.fileService.share(result.id, result['newIsShareable'], result['newIsPublic'], result['newViewers'], result['newEditors']);
                    break;
                case 'rename':
                    promise = _this.fileService.rename(result.id, result['newName']);
                    break;
                case 'delete':
                    promise = _this.fileService.deleteFile(result.id);
                    break;
            }
            promise.then(function () {
                _this.parent.refreshFiles();
            }).catch(function (error) {
                _this.root.errorMsg = error;
            });
        }, function (reason) {
        });
    };
    return FileDisplayComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", File_1.default)
], FileDisplayComponent.prototype, "item", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.TemplateRef)
], FileDisplayComponent.prototype, "deleteFileDialog", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.TemplateRef)
], FileDisplayComponent.prototype, "renameFileDialog", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.TemplateRef)
], FileDisplayComponent.prototype, "shareFileDialog", void 0);
FileDisplayComponent = __decorate([
    core_1.Component({
        selector: 'file-item',
        templateUrl: "/app/files/fileDisplay.html"
    }),
    __metadata("design:paramtypes", [FileService_1.FileService,
        ng_bootstrap_1.NgbModal,
        TemplateComponent_1.TemplateComponent,
        FilesComponent_1.FilesComponent])
], FileDisplayComponent);
exports.FileDisplayComponent = FileDisplayComponent;
//# sourceMappingURL=FileDisplayComponent.js.map