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
            
            if (!vm.user.teacher){
                vm.user.teacher = false;
            }
            ApiService.Register(vm.user)
                .then(function (response) {
                    if (response.success) {
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
