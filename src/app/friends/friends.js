"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FriendService_1 = require("../service/FriendService");
var MWUFriends = (function () {
    function MWUFriends() {
    }
    return MWUFriends;
}());
MWUFriends = __decorate([
    core_1.NgModule({
        imports: [FriendService_1.FriendService]
    })
], MWUFriends);
exports.MWUFriends = MWUFriends;
/**

angular.module('MindWebUi.friends', [
        'MindWebUi.friend.service',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router',
        'ngFileUpload'
    ])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('friends', {
                    abstract: true,
                    url: '/friends',
                    template: '<section ui-view></section>',
                    data: {
                        requireLogin: true // this property will apply to all children of 'app'
                    }
                })
                .state('friends.list', {
                    url: '',
                    templateUrl: 'app/friends/friends.html',
                    controller: 'friendController'
                })
        }
    ])
    .controller('friendController', function ($rootScope, $scope, $http, $modal, $state, Upload, FriendService) {
        reloadFriends();

        // Utility functions for controller
        function reloadFriends() {
            $rootScope.$emit('$routeChangeStart');
            FriendService.list().then(function (data) {
                    $scope.files = data;
                    $rootScope.$emit('$routeChangeSuccess');
                },
                function () {
                    $rootScope.$emit('$routeChangeSuccess');
                });
        }

    });*
 */ 
//# sourceMappingURL=friends.js.map