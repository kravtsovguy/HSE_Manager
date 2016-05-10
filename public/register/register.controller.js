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
                        //$window.alert("user: "+JSON.stringify(vm.user));

            vm.dataLoading = true;
            
            if (!vm.user.teacher){
                vm.user.teacher = false;
            }
            //$window.alert("user: "+JSON.stringify(vm.user));
            ApiService.Register(vm.user)
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
