(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['ApiService', '$location', '$rootScope', 'FlashService','$window'];
    function LoginController(ApiService, $location, $rootScope, FlashService, $window) {
        

        var vm = this;
        vm.login = login;
        
        function login() {
            vm.dataLoading = true;
            //$window.alert("user");
            ApiService.TryLogin({ email:vm.username, password:vm.password})
                .then(function (response) {
                if (response.success) {
                    //AuthenticationService.SetCredentials(vm.username, response.authdata);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
        
    }

})();
