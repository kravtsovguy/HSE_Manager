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
        
        vm.work = {title: "none", text: "none"};
        vm.sendjob = sendjob;
        
        initController();
        
        function initController(){
            ApiService.GetWork($routeParams.id)
            .then(function (work){
                vm.work = work;
            }, function (){
                $location.path('/');
            });
        }
        
        function sendjob(){
            vm.myjob.date = Math.floor((new Date()).getTime() / 1000);
            vm.myjob.user = ApiService.GetUserId();
            //$window.alert("file: "+ApiService.GetUserId());
            /*ApiService.AddJob(vm.myjob,vm.file)
            .then(function (error){
                if(!error){
                    //$window.alert("ok!");
                    $window.location.reload();
                }
            });*/
        }
        
        //$window.alert($routeParams.id);

        
    }

})();
