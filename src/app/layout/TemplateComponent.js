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
/**
 * Created by gpapp on 2017.02.20..
 */
var core_1 = require("@angular/core");
var UserService_1 = require("../service/UserService");
var TemplateComponent = (function () {
    function TemplateComponent(userService) {
        this.userService = userService;
        this._sidebarDisplay = true;
        this._loginRequired = false;
    }
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
    Object.defineProperty(TemplateComponent.prototype, "sidebarDisplay", {
        get: function () {
            return this._sidebarDisplay;
        },
        set: function (value) {
            this._sidebarDisplay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplateComponent.prototype, "loginRequired", {
        get: function () {
            return this._loginRequired;
        },
        set: function (value) {
            this._loginRequired = value;
        },
        enumerable: true,
        configurable: true
    });
    TemplateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.lookup().then(function (user) { return _this._currentUser = user; }, function (error) { return _this._errorMsg = error; });
    };
    TemplateComponent.prototype.logout = function () {
        var _this = this;
        this.userService.logout().then(function (user) { return _this._currentUser = user; }, function (error) { return _this._errorMsg = error; });
    };
    TemplateComponent.prototype.toggleSidebar = function () {
        this._sidebarDisplay = !this._sidebarDisplay;
    };
    return TemplateComponent;
}());
TemplateComponent = __decorate([
    core_1.Component({
        providers: [UserService_1.UserService],
        selector: "main-app",
        templateUrl: "/app/layout/template.html"
    }),
    __metadata("design:paramtypes", [UserService_1.UserService])
], TemplateComponent);
exports.TemplateComponent = TemplateComponent;
//# sourceMappingURL=TemplateComponent.js.map