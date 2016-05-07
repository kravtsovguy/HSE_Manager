(function () {
    'use strict';

    angular
        .module('app')
        .controller('WorkEditController', WorkEditController);

    WorkEditController.$inject = ['ApiService', '$location', '$rootScope', 'FlashService','$window','$routeParams'];
    function WorkEditController(ApiService, $location, $rootScope, FlashService, $window, $routeParams) {
        var vm = this;

        vm.workid = $routeParams.id;
        vm.save = save;
        
        init();
        function init(){
            loadWork();
        }
        
        function loadWork(){
            if (!vm.workid) return;
            ApiService.GetWork(vm.workid)
            .then(function (work){
                vm.work = work;
            }, function (){
                $location.path('/');
            });
        }
        
        function save() {
            vm.dataLoading = true;
            
            var onComplete = function(error) {
              if(error){
                    vm.dataLoading = false;
                }else{
                    $location.path('/');
                }
            };
            
            if(vm.workid){
                ApiService.SaveWork(vm.workid, vm.work).then(onComplete);
            }else{
                ApiService.AddWork(vm.work).then(onComplete);
            }
        }
    }

})();
