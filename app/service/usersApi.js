/**
 * Created by gpapp on 2015.05.15..
 */
app.factory("UsersApi", function ($q) {
    function _login(email, password) {
        var d = $q.defer();
        setTimeout(function () {
            if (email == password) {
                d.resolve({id: 1, name: 'Robi', email: 'robi@betyar.hu'});
            }
            //defer.reject();
        }, 100);
        return d.promise;
    }

    return {login: _login};
});