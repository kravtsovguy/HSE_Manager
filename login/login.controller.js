(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['ApiService','$location', 'AuthenticationService', 'FlashService','$window'];
    function LoginController(ApiService, $location, AuthenticationService, FlashService, $window) {
        $window.alert("user: ");
/*
        var vm = this;

        vm.login = login;


        (function initController() {
            // reset login status

            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            ApiService.Login(vm.username, vm.password)
                .then(function (response) {
                if (response.success) {
                    //AuthenticationService.SetCredentials(vm.username, response.authdata);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
            /*AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });*/
        
        
        };
    }

})();
