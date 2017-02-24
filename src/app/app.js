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
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var SidebarComponent_1 = require("./layout/SidebarComponent");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var UserService_1 = require("./service/UserService");
var LoginComponent_1 = require("./login/LoginComponent");
var not_found_component_1 = require("./not-found.component");
var HomeComponent_1 = require("./layout/HomeComponent");
var TemplateComponent_1 = require("./layout/TemplateComponent");
var AboutComponent_1 = require("./layout/AboutComponent");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var material_1 = require("@angular/material");
var appRoutes = [
    { path: '', component: HomeComponent_1.HomeComponent },
    { path: 'about', component: AboutComponent_1.AboutComponent },
    { path: '**', component: not_found_component_1.PageNotFoundComponent }
];
var AppModule = (function () {
    function AppModule(userService) {
        this.userService = userService;
    }
    AppModule.prototype.ngOnInit = function () {
    };
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, router_1.RouterModule.forRoot(appRoutes), forms_1.FormsModule, material_1.MaterialModule, ng_bootstrap_1.NgbModule.forRoot()],
        providers: [UserService_1.UserService],
        declarations: [not_found_component_1.PageNotFoundComponent, TemplateComponent_1.TemplateComponent, SidebarComponent_1.SidebarComponent, HomeComponent_1.HomeComponent, AboutComponent_1.AboutComponent, LoginComponent_1.LoginComponent],
        bootstrap: [TemplateComponent_1.TemplateComponent]
    }),
    __metadata("design:paramtypes", [UserService_1.UserService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.js.map