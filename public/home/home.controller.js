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
        vm.editwork = editwork;
        
        initController();

        function initController(){
            check();
            loadCurrentUser();
            loadAllWorks();
        }
        
        function check(){
            ApiService.CheckUser(ApiService.getAuth().uid)
            .then(function (response){
                if(!response.success){
                    $location.path('/login');
                }
            });
        }
        
        function loadCurrentUser(){
            ApiService.getMe()
            .then(function (user){
                vm.myuser = user;
                
                if(vm.myuser.teacher){
                    vm.status = "Преподаватель";
                }else{
                    vm.status = "Студент";
                }
            });
        }
        
        function towork(id){
            $location.path('/work/'+id);
        }
        
        function editwork(id){
            $location.path('/work/edit/'+id);
        }
        
        function deletework(id){
            ApiService.DeleteWork(id)
            .then(function (){
                $window.location.reload();
            });
        }
        
        function loadAllWorks(){
            ApiService.GetAllWorks()
                .then(function (works){
                vm.works = [];
                Object.keys(works).reverse().forEach(function (key){
                    vm.works.push({id:key, work:works[key]});
                });
            });
        }
        
        function logout(){
            
            ApiService.Logout();
        }


    }

})();