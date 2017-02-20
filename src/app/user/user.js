"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var UserService_1 = require("../service/UserService");
var MWUUser = (function () {
    function MWUUser() {
    }
    return MWUUser;
}());
MWUUser = __decorate([
    core_1.NgModule({
        imports: [UserService_1.UserService]
    })
], MWUUser);
exports.MWUUser = MWUUser;
/**angular.module('MindWebUi.user', [
    'MindWebUi.user.service',
    'ui.router'
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('user', {
                    abstract: true,
                    url: '/user',
                    template: '<section ui-view></section>',
                    data: {
                        requireLogin: true // this property will apply to all children of 'app'
                    }
                })
                .state('user.options', {
                    url: '/options',
                    templateUrl: 'app/user/options.html'
                })
                .state('user.logout',
                {
                    url: '/logout',
                    template: '<section ui-view></section>',
                    controller: 'logoutController'
                });
        }
    ])
    .controller('logoutController', function ($state, $rootScope, UsersApi) {
        delete $rootScope.lookup;
        UsersApi.logout();
        $state.go('home');
    })
;*/ 
//# sourceMappingURL=user.js.map