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

        function initController() {
            /*ApiService.TestApi()
            .then(function (data){
                alert(JSON.stringify(data));
            },function (resp){
                alert(JSON.stringify(resp));
            });*/
            //loadCurrentUser();
            //loadAllUsers();
            loadCurrentUser();
            loadAllWorks();
            //UserService.GetAllWorks();
            /*UserService.AddWork({
                title: "CP - 1",
                descr: "bla bla"
            });*/
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
            /*$rootScope.globals.userid = ApiService.getAuth().uid;
            ApiService.GetUser(ApiService.getAuth().uid)
            .then(function (user){
                vm.user = user;
                $rootScope.globals.user = user;
                //$window.alert("user: "+JSON.stringify($rootScope.globals.user));
            });*/
        }
        
        function towork(id){
            //$window.alert("work: "+JSON.stringify(vm.works[Object.keys(vm.works)[index]]));
            //$window.alert("work: "+Object.keys(vm.works)[index]);
            //$location.path('/work/'+Object.keys(vm.works)[index]);
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
                //$window.alert(JSON.stringify(vm.works));
                //vm.works = vm.works.reverse();
            });
        }
        
        function logout(){
            
            ApiService.Logout();
        }


    }

})();