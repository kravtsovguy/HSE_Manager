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
        //vm.myjob=null;
        vm.tojob = tojob;
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
                if(jobs == null){
                    vm.myjob = {id:"0"};
                    return;
                }
                vm.jobs = jobs;
                
                //$window.alert("myjob: "+JSON.stringify(vm.myjob));
                
                $.each( jobs, function( key, value ) {
                    //$window.alert(JSON.stringify(value.user));
                    if(value.user == ApiService.getAuth().uid){
                        vm.myjob = {id:key, job:value};
                    }
                    ApiService.GetUser(value.user).then(function (user){
                        vm.jusers.push({id:key, text:user.email});
                        //$window.alert(JSON.stringify(jusers));
                    });
                  //$window.alert( key + ": " + JSON.stringify(value) );
                    
                });
                //$window.alert("myjob: "+JSON.stringify(vm.myjob));
                if(vm.myjob == null){
                    vm.myjob = {id:"0"};
                }
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
            //$window.alert("---: "+JSON.stringify(vm.fileinfo));
            ApiService.AddJob(vm.myjob,vm.fileinfo)
            .then(function (error){
                if(!error){
                    //$window.alert("ok!");
                    $window.location.reload();
                }
            });
        }
        
        function getExt(str){
            return str.substring(str.lastIndexOf('.') + 1);
        }
        
        /*function tojob(index){
            $location.path('/job/'+Object.keys(vm.jobs)[index]);
        }*/
        function tojob(id){
            $location.path('/job/'+id);
        }
        
        //$window.alert($routeParams.id);

        
    }

})();
