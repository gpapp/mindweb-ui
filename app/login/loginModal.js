angular.module('MindWebUi.login', [
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'MindWebUi.user.service'
])
    .service('loginModal', function ($modal, $rootScope) {

        function assignCurrentUser(user) {
            $rootScope.currentUser = user;
            return user;
        }

        return function () {
            var instance = $modal.open({
                templateUrl: 'app/login/loginModal.html',
                controller: 'LoginModalCtrl',
                controllerAs: 'LoginModalCtrl'
            });

            return instance.result.then(assignCurrentUser);
        };
    })
    .controller('LoginModalCtrl', function ($scope, UsersApi) {

        this.cancel = $scope.$dismiss;

        this.submit = function (email, password) {
            UsersApi.login(email, password).then(function (user) {
                $scope.$close(user);
            });
        };

    });
