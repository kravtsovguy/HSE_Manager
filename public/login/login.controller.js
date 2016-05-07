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
        }
        
    }

})();