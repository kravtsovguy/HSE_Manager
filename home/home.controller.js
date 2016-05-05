(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['ApiService', '$rootScope', '$window','$location'];
    function HomeController(ApiService, $rootScope, $window,$location) {
        var vm = this;

        
        vm.user = {firstName: "Матвей"};
        vm.works = [];
        vm.towork = towork;
        
        initController();

        function initController() {
            //loadCurrentUser();
            //loadAllUsers();
            loadAllWorks();
            //UserService.GetAllWorks();
            /*UserService.AddWork({
                title: "CP - 1",
                descr: "bla bla"
            });*/
        }
        
        function towork(index){
            //$window.alert("work: "+JSON.stringify(vm.works[Object.keys(vm.works)[index]]));
            //$window.alert("work: "+Object.keys(vm.works)[index]);
            $location.path('/work/'+Object.keys(vm.works)[index]);
        }
        
        function loadAllWorks(){
            ApiService.GetAllWorks()
                .then(function (works){
                vm.works = works;
            });
        }


    }

})();