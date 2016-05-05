(function () {
    'use strict';

    var mapp = angular
        .module('app');
    
    mapp.controller('WorkController', WorkController);
    
    mapp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);


    WorkController.$inject = ['ApiService','$location','$routeParams','$window'];
    function WorkController(ApiService, $location,$routeParams,$window) {
        var vm = this;
        
        vm.workid = $routeParams.id;
        vm.work = {title: "none", text: "none"};
        vm.sendjob = sendjob;
        vm.jobs=[];
        vm.myjob={};
        
        initController();
        
        function initController(){
            ApiService.GetWork(vm.workid)
            .then(function (work){
                vm.work = work;
            }, function (){
                $location.path('/');
            });
            
            ApiService.GetJobs(vm.workid)
            .then(function (jobs){
                vm.jobs = jobs;
            });
        }
        
        function sendjob(){
            vm.myjob.date = Math.floor((new Date()).getTime() / 1000);
            vm.myjob.user = ApiService.authdata.uid;
            vm.myjob.work = vm.workid;
            //$window.alert("user: "+vm.myjob.user);
            ApiService.AddJob(vm.myjob,vm.file)
            .then(function (error){
                if(!error){
                    //$window.alert("ok!");
                    $window.location.reload();
                }
            });
        }
        
        //$window.alert($routeParams.id);

        
    }

})();
