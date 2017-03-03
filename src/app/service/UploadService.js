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
var Rx_1 = require("rxjs/Rx");
var core_1 = require("@angular/core");
var UploadService = (function () {
    function UploadService() {
        var _this = this;
        this._progress = Rx_1.Observable.create(function (observer) {
            _this._progressObserver = observer;
        }).share();
    }
    Object.defineProperty(UploadService.prototype, "progressObserver", {
        get: function () {
            return this._progressObserver;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploadService.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        enumerable: true,
        configurable: true
    });
    UploadService.prototype.makeFileRequest = function (url, files) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            var formData = new FormData(), xhr = new XMLHttpRequest();
            for (var i = 0; i < files.length; i++) {
                formData.append("files", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = function (event) {
                var progress = Math.round(event.loaded / event.total * 100);
                _this._progressObserver.next(progress);
            };
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    };
    return UploadService;
}());
UploadService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=UploadService.js.map