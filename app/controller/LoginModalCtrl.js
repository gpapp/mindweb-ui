/**
 * Created by gpapp on 2015.05.15..
 */
// LoginModalCtrl.js

app.controller('LoginModalCtrl', function ($scope, UsersApi) {

    this.logout = function () {
        $rootScope.currentUser = null;
    };

    this.cancel = $scope.$dismiss;

    this.submit = function (email, password) {
        UsersApi.login(email, password).then(function (user) {
            $scope.$close(user);
        });
    };

});