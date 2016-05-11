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
    
    mapp.directive('file', function() {
    return {
        require:"ngModel",
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];

                ngModel.$setViewValue(file);
                $scope.$apply();
            });
        }
    };
});


    WorkController.$inject = ['ApiService','$location','$routeParams','$window'];
    function WorkController(ApiService, $location,$routeParams,$window) {
        var vm = this;
        
        vm.workid = $routeParams.id;
        vm.work = {title: "none", text: "none"};
        vm.sendjob = sendjob;
        vm.jobs=[];
        vm.jusers=[];
        vm.tojob = tojob;
        initController();
        
        function initController(){
            loadCurrentUser();
            
            ApiService.GetWork(vm.workid)
            .then(function (work){
                vm.work = work;
            }, function (){
                $location.path('/');
            });
            
            ApiService.GetJobs(vm.workid)
            .then(function (jobs){
                if(jobs == null){
                    vm.myjob = {id:"0"};
                    return;
                }
                vm.jobs = jobs;
                
                Object.keys(jobs).reverse().forEach(function (key){
                    var value = jobs[key];
                    if(value.user == ApiService.getAuth().uid){
                        vm.myjob = {id:key, job:value};
                    }
                    ApiService.GetUser(value.user).then(function (user){
                        ApiService.GetRate(key)
                        .then(function (rate){
                            vm.jusers.push({id:key, user:user, rate:rate});
                            if(value.user == ApiService.getAuth().uid){
                                vm.myjob.rate = rate;
                            }
                        });
                    });
                    
                });
                if(vm.myjob == null){
                    vm.myjob = {id:"0"};
                }
            });
        }
        
        function loadCurrentUser(){
            ApiService.getMe()
            .then(function (user){
                vm.myuser = user;
            });
        }
        
        function sendjob(){
            vm.myjob.date = Math.floor((new Date()).getTime() / 1000);
            vm.myjob.user = ApiService.getAuth().uid;
            vm.myjob.work = vm.workid;
            vm.fileinfo = {
                file: vm.file,
                ext: getExt(vm.filename.name)
            };
            ApiService.AddJob(vm.myjob,vm.fileinfo)
            .then(function (error){
                if(!error){
                    $window.location.reload();
                }
            });
        }
        
        function getExt(str){
            return str.substring(str.lastIndexOf('.') + 1);
        }
        
        function tojob(id){
            $location.path('/job/'+id);
        }

        
    }

})();
