(function () {
    'use strict';

    angular
        .module('app')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$http','$window','$q','$rootScope'];
    function ApiService($http,$window,$q,$rootScope) {
        
        var fire = new Firebase("https://hsemanager2.firebaseio.com");

        
        var service = {};

        service.Create = Create;
        service.Login = Login;
        service.AddWork = AddWork;
        service.GetAllWorks = GetAllWorks;
        service.GetWork = GetWork;
        service.AddJob = AddJob;
        service.GetJobs = GetJobs;
        service.fire = fire;
        service.getAuth = getAuth;
        service.GetJob = GetJob;
        service.DeleteJob = DeleteJob;
        service.GetUser = GetUser;
        service.GetFile = GetFile;
        service.DeleteWork = DeleteWork;
        service.AddRate = AddRate;
        service.DeleteRate = DeleteRate;
        service.GetRate = GetRate;
        service.SaveUser = SaveUser;
        service.getMe = getMe;
        service.Logout = Logout;
        service.SaveWork = SaveWork;
        service.Register = Register;
        service.TryLogin = TryLogin;
        service.CheckUser = CheckUser;
        
        return service;
        
        function Logout(){
            $rootScope.user = null;
            fire.unauth();
        }
        
        
        function SaveWork(id,work) {
            
            var deferred = $q.defer();
            
            var onComplete = function(error) {
              deferred.resolve(error);
            };
            
            fire.child("works/"+id).set(work, onComplete);
            
            return deferred.promise;
        }
        
        
        function getMe(){
            var deferred = $q.defer();
            
            if($rootScope.user){
                deferred.resolve($rootScope.user);
            }else{
                GetUser(getAuth().uid)
                .then(function (user){
                    $rootScope.user = user;
                    deferred.resolve(user);
                });
            }
            
            return deferred.promise;
        }
        
        function getAuth(){
            return fire.getAuth();
        }
        
        function SaveUser(id,user){
            var deferred = $q.defer();
            
            var onComplete = function(error) {
                $rootScope.user = user;
              deferred.resolve(error);
            };
            
            fire.child("users/"+id).set(user, onComplete);
            
            return deferred.promise;
        }
        
        function GetRate(id){
            var deferred = $q.defer();

            fire.child("rates/"+id).once("value", function(snapshot) {
                
                deferred.resolve(snapshot.val());

            }, function (errorObject){
                deferred.reject();
            });
            
            return deferred.promise;
        }
        
        function DeleteRate(id){
            var deferred = $q.defer();
            
            fire.child("rates/"+id).remove(function(error) {
                if(error)
                    deferred.reject(error);
                else{
                    deferred.resolve();
                }
            });
            
            return deferred.promise;
        }
        
        function AddRate(jobid,rate){
            var deferred = $q.defer();
            
            var onComplete = function(error) {
              deferred.resolve(error);
            };
            
            fire.child("rates/"+jobid).set(rate, onComplete);
            
            return deferred.promise;
        }
        
        function DeleteWork(id){
            
            var deferred = $q.defer();
            
            fire.child("works/"+id).remove(function(error) {
                if(error)
                    deferred.reject(error);
                else{
                    deferred.resolve();
                }
            });
            
            return deferred.promise;
        }
        
        function GetFile(jobid){
            var deferred = $q.defer();

            fire.child("files/"+jobid).once("value", function(snapshot) {

                if(snapshot.val())
                    deferred.resolve(snapshot.val());
                else
                    deferred.reject();
            }, function (errorObject){
                deferred.reject();
            });
            
            return deferred.promise;
        }
        
        function GetUser(id){
            var deferred = $q.defer();

            fire.child("users/"+id).once("value", function(snapshot) {
                if(snapshot.val())
                    deferred.resolve(snapshot.val());
                else
                    deferred.reject();
            }, function (errorObject){
                deferred.reject();
            });
            
            return deferred.promise;
        }
        
        function DeleteJob(id){

            var deferred = $q.defer();
            
            fire.child("jobs/"+id).remove(function(error) {
                if(error)
                    deferred.reject(error);
                else{
                    fire.child("files/"+id).remove(function(error) {
                    if(error)
                        deferred.reject(error);
                    else
                        deferred.resolve();
                });
                }
            });
            
            return deferred.promise;
        }
        
        function GetJob(id){
            var deferred = $q.defer();
            
            fire.child("jobs/"+id).once("value", function(snapshot) {
                if(snapshot.val())
                    deferred.resolve(snapshot.val());
                else
                    deferred.reject();
            }, function (errorObject){
                deferred.reject();
            });
            
            return deferred.promise;
        }
        
        function GetJobs(workid){
            var deferred = $q.defer();

            fire.child("jobs").orderByChild("work").equalTo(workid).once("value", function(snapshot) {
                deferred.resolve(snapshot.val());
            }, function (errorObject) {
                deferred.reject();
            });
            
            return deferred.promise;
        }
        
        function AddJob(job,fileinfo){
            var deferred = $q.defer();
            
            if(fileinfo.file){
            var jpush = fire.child("jobs").push();
            jpush.set(job, function(error) {
                fire.child("files/"+jpush.key()).set(fileinfo, function (error2){
                    deferred.resolve(error2);
                });
            });
            }
            
            return deferred.promise;
        }
        
        function GetWork(id){
            var deferred = $q.defer();
            fire.child("works/"+id).once("value", function(snapshot) {
                if(snapshot.val())
                    deferred.resolve(snapshot.val());
                else
                    deferred.reject();
            }, function (errorObject){
                deferred.reject();
            });
            
            return deferred.promise;
        }
        
        function GetAllWorks(){
            var deferred = $q.defer();
            
            fire.child("works").once("value", function(snapshot) {
                deferred.resolve(snapshot.val());
            }, function (errorObject) {
                deferred.reject();
            });
            
            return deferred.promise;
            
        }
        
        function AddWork(work) {
            var deferred = $q.defer();
            
            var onComplete = function(error) {
              deferred.resolve(error);
            };
            
            fire.child("works").push().set(work, onComplete);
            
            return deferred.promise;
        }
        
        function Register(user){
            var deferred = $q.defer();
            
            if(user.teacher){
                fire.child("keys").orderByChild("Key").equalTo(user.code).once("value", function(snapshot) {
                    var code = snapshot.val();
                    if(code){
                        Create(user)
                        .then(function (response){
                            if(response.success){
                                var key = Object.keys(code)[0];
                                fire.child("keys").child(key).update({
                                    Date:Math.floor((new Date()).getTime() / 1000),
                                    UsedBy:response.userData.uid
                                },function(error){
                                    if(error){
                                        deferred.resolve({ success: false, message: error });
                                    }else{
                                        deferred.resolve(response);
                                    }
                                })
                            }else{
                                deferred.resolve(response);
                            }
                        });
                    }else
                    deferred.resolve({ success: false, message: "Неверный код" });
                }, function (errorObject) {
                    deferred.resolve({ success: false, message: errorObject });
                });
            }else{
                Create(user)
                .then(function (response){
                    deferred.resolve(response);
                });
            }
            
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();
            
            
            fire.createUser({
                email    : user.username,
                password : user.password
            }, function(error, userData) {
                if (error) {
                    deferred.resolve({ success: false, message: error });
                  } else {
                    fire.child("users").child(userData.uid).set({
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.username,
                      teacher: user.teacher
                    }, function (error){
                        if(error){
                            deferred.resolve({ success: false, message: error });
                        }else{
                            deferred.resolve({ success: true, userData: userData });
                        }
                    });
                    }
            });
            
            return deferred.promise;
        }
        
        function CheckUser(id,response){
            var deferred = $q.defer();
            if(!response){
                response = {success:true, message:"OK!"}
            }

            fire.child("keys").orderByChild("UsedBy").equalTo(id).once("value", function(snapshot) {
                    var code = snapshot.val();
                    if(code){
                        var key = Object.keys(code)[0];
                        if(code[key].Date == -1){
                            Logout();
                            deferred.resolve({success: false, message: "Ваш аккаунт заблокирован!"});
                        }else{
                            deferred.resolve(response);
                        }
                    }else{
                        deferred.resolve(response);
                    }
                    }, function (errorObject) {
                        deferred.resolve({ success: false, message: errorObject });
                    });
            
            return deferred.promise;
        }
        
        function TryLogin(user){
            var deferred = $q.defer();
            
            
            Login(user.email,user.password)
            .then(function (response){
                if(response.success) {
                    CheckUser(response.authdata.uid,response)
                    .then(function (response2){
                        deferred.resolve(response2);
                    });
                }else{
                    deferred.resolve(response);
                }
            });
            
            return deferred.promise;
        }
        
        function Login(email,password){
            var deferred = $q.defer();

            fire.authWithPassword({
              email    : email,
              password : password
            }, function(error, authData) {
              if (error) {
                deferred.resolve({success: false, message: error});
              } else {
                deferred.resolve({success: true, authdata: authData});
              }
            });
            
            return deferred.promise;

        }
    }

})();
