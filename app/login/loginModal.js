angular.module('MindWebUi.login', [
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'MindWebUi.user.service'
])
    .service('loginModal', function ($modal, $rootScope, UsersApi) {

        function assignCurrentUser(user) {
            $rootScope.currentUser = user;
            return user;
        }

        return function () {
            UsersApi.lookup().then(assignCurrentUser);

            var instance = $modal.open({
                templateUrl: 'app/login/loginModal.html',
                controller: 'LoginModalCtrl',
                controllerAs: 'LoginModalCtrl',
                size: 'md'
            });

            return instance.result.then(assignCurrentUser);
        };
    })
    .controller('LoginModalCtrl', function () {
    });
