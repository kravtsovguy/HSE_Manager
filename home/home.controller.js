(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['ApiService', '$rootScope', '$window','$location'];
    function HomeController(ApiService, $rootScope, $window,$location) {
        var vm = this;

        
        vm.user = {email: ApiService.getAuth().password.email};
        vm.works = [];
        vm.towork = towork;
        vm.logout = logout;
        vm.deletework = deletework;
        
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
        
        function deletework(index){
            ApiService.DeleteWork(Object.keys(vm.works)[index])
            .then(function (){
                $window.location.reload();
            });
        }
        
        function loadAllWorks(){
            ApiService.GetAllWorks()
                .then(function (works){
                vm.works = works;
            });
        }
        
        function logout(){
            ApiService.fire.unauth();
        }


    }

})();