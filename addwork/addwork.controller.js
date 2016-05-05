(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddWorkController', AddWorkController);

    AddWorkController.$inject = ['ApiService', '$location', '$rootScope', 'FlashService','$window'];
    function AddWorkController(ApiService, $location, $rootScope, FlashService, $window) {
        var vm = this;

        vm.save = save;

        function save() {
            vm.dataLoading = true;
            
            ApiService.AddWork(vm.work)
            .then(function (error){
                if(error){
                    vm.dataLoading = false;
                }else{
                    $location.path('/');
                }
            });
        }
    }

})();
