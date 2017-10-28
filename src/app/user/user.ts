import {NgModule} from '@angular/core';
import {UserService} from '../service/UserService';
@NgModule({
    imports: [UserService]
})
export class MWUUser{
}

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
                .state('user.logoutPromise',
                {
                    url: '/logoutPromise',
                    template: '<section ui-view></section>',
                    controller: 'logoutController'
                });
        }
    ])
    .controller('logoutController', function ($state, $rootScope, UsersApi) {
        delete $rootScope.lookupPromise;
        UsersApi.logoutPromise();
        $state.go('home');
    })
;*/