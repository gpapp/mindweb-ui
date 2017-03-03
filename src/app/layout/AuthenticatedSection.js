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
var router_1 = require("@angular/router");
var UserService_1 = require("../service/UserService");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
/**
 * Created by gpapp on 2017.02.25..
 */
var AuthenticatedSection = (function () {
    function AuthenticatedSection(userService, router, location) {
        this.userService = userService;
        this.router = router;
        this.location = location;
        if (!userService) {
            this.location.replaceState('/'); // clears browser history so they can't navigate with back button
            this.router.navigate(['PublicPage']);
        }
    }
    return AuthenticatedSection;
}());
AuthenticatedSection = __decorate([
    core_1.Directive({ selector: '[protected]' }),
    __metadata("design:paramtypes", [UserService_1.UserService, router_1.Router, common_1.Location])
], AuthenticatedSection);
exports.AuthenticatedSection = AuthenticatedSection;
//# sourceMappingURL=AuthenticatedSection.js.map