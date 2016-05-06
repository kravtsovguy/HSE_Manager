(function () {
    'use strict';

    angular
        .module('app')
        .controller('JobController', JobController);

    JobController.$inject = ['ApiService', '$location', '$routeParams', 'FlashService','$window','$rootScope'];
    function JobController(ApiService, $location, $routeParams, FlashService, $window, $rootScope) {
        
        var vm = this;
        vm.jobid = $routeParams.id;
        vm.download = download;
        vm.back = back;
        vm.deleteJob = deleteJob;
        vm.rateJob = rateJob;
        vm.deleteRate = deleteRate;
        vm.myuserid = ApiService.getAuth().uid;//$rootScope.globals.userid;
        
        initController();
        function initController(){
            loadCurrentUser();
            
            ApiService.GetJob(vm.jobid)
            .then(function (job){
                vm.job = job;

                ApiService.GetUser(job.user)
                .then(function (user){
                    vm.user = user;
                });
                ApiService.GetWork(job.work)
                .then(function (work){
                    vm.work = work;
                });
            }, function (){
                $location.path('/');
            });
            ApiService.GetRate(vm.jobid)
            .then(function (rate){
                if(rate == null){
                    vm.rate = {rate: '-1'};
                    return;
                }
                vm.rate = rate;
                ApiService.GetUser(rate.user)
                .then(function (user){
                    vm.rateUser = user;
                });
            });
        }
        
        function loadCurrentUser(){
            ApiService.getMe()
            .then(function (user){
                vm.myuser = user;
            });
        }
        
        function deleteJob(){
            ApiService.DeleteJob(vm.jobid)
            .then(function (){
                back();
            });
        }
        
        function rateJob(){
            //$window.alert("rating: "+JSON.stringify(vm.rating));
            vm.rating.user = vm.myuserid;
            ApiService.AddRate(vm.jobid,vm.rating)
            .then(function (error){
                $window.location.reload();
            });
        }
        
        function deleteRate(){
            ApiService.DeleteRate(vm.jobid)
            .then(function (){
                $window.location.reload();
            });
        }
        
        
        function download() {
            ApiService.GetFile(vm.jobid)
            .then(function (fileinfo){
               downloadData("data."+fileinfo.ext,fileinfo.file);
            });
        }
        
        function back(){
            $location.path('/work/'+vm.job.work);
        }
        
        function downloadData(filename, data) {
              var element = document.createElement('a');
                element.setAttribute('href', data);
                //element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
              element.setAttribute('download', filename);

              element.style.display = 'none';
              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
        }
        
    }

})();
