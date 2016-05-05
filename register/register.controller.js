(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['ApiService', '$location', '$rootScope', 'FlashService','$window'];
    function RegisterController(ApiService, $location, $rootScope, FlashService, $window) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            ApiService.Create(vm.user)
                .then(function (response) {
                    //$window.alert("response: "+JSON.stringify(response));
                    if (response.success) {
                        //$window.alert("ok! "+JSON.stringify(response.userData));
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
