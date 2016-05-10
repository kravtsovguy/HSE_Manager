(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['ApiService', '$location', '$routeParams', 'FlashService','$window','$rootScope'];
    function ProfileController(ApiService, $location, $routeParams, FlashService, $window, $rootScope) {
        
        var vm = this;
        vm.saveUser = saveUser;
        vm.userid = ApiService.getAuth().uid;
        vm.dataLoading = false;
        
        initController();
        
        function initController(){
            ApiService.getMe()
                .then(function (user){
                    vm.user = user;
                    //$window.alert("user: "+vm.user);
                });
        }
        
        function saveUser(){
            vm.dataLoading = true;
            ApiService.SaveUser(vm.userid,vm.user)
            .then(function (error){
                vm.dataLoading = false;
                $location.path("/");
            });
        }
        
    }

})();
