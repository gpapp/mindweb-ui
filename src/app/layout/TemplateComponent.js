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
/**
 * Created by gpapp on 2017.02.20..
 */
var core_1 = require("@angular/core");
var UserService_1 = require("../service/UserService");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var TemplateComponent = (function () {
    function TemplateComponent(userService, modalService) {
        this.userService = userService;
        this.modalService = modalService;
        this._loading = true;
    }
    Object.defineProperty(TemplateComponent.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplateComponent.prototype, "infoMsg", {
        get: function () {
            return this._infoMsg;
        },
        set: function (value) {
            this._infoMsg = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplateComponent.prototype, "errorMsg", {
        get: function () {
            return this._errorMsg;
        },
        set: function (value) {
            this._errorMsg = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplateComponent.prototype, "currentUser", {
        get: function () {
            return this._currentUser;
        },
        enumerable: true,
        configurable: true
    });
    TemplateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.lookupPromise().then(function (user) {
            _this._loading = false;
            return _this._currentUser = user;
        }, function (error) {
            _this._loading = false;
            _this._errorMsg = error;
        });
    };
    TemplateComponent.prototype.open = function (content) {
        this.modalService.open(content).result.then(function (result) {
        }, function (reason) {
        });
    };
    TemplateComponent.prototype.logout = function () {
        var _this = this;
        this._loading = true;
        this.userService.logoutPromise().then(function (user) {
            _this._loading = false;
            delete _this._currentUser;
        }, function (error) {
            _this._loading = false;
            _this._errorMsg = error;
        });
    };
    return TemplateComponent;
}());
TemplateComponent = __decorate([
    core_1.Component({
        providers: [UserService_1.UserService],
        selector: "main-app",
        templateUrl: "/app/layout/template.html"
    }),
    __metadata("design:paramtypes", [UserService_1.UserService, ng_bootstrap_1.NgbModal])
], TemplateComponent);
exports.TemplateComponent = TemplateComponent;
//# sourceMappingURL=TemplateComponent.js.map