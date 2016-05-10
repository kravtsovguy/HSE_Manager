(function () {
    'use strict';

    angular
        .module('app')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$http','$window','$q','$rootScope'];
    function ApiService($http,$window,$q,$rootScope) {
        
        var fire = new Firebase("https://hsemanager2.firebaseio.com");

        
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.Login = Login;
        service.AddWork = AddWork;
        service.GetAllWorks = GetAllWorks;
        service.GetWork = GetWork;
        service.AddJob = AddJob;
        service.GetJobs = GetJobs;
        service.fire = fire;
        //service.authdata = fire.getAuth();
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
        service.TestApi = TestApi;
        service.Register = Register;
        service.TryLogin = TryLogin;
        service.CheckUser = CheckUser;
        
        return service;
        
        function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert("error: "+JSON.stringify(jqXHR));
                //self.error(errorThrown);
            });
        }

        function getAllBooks() {
            ajaxHelper("http://192.168.1.19/api/values", 'GET').done(function (data) {
                alert("done: "+JSON.stringify(data));
                //self.books(data);
            });
        }
        
        
        function TestApi(){

            alert("Start test...");
            
            $.ajax({
            url : "http://google.com/",
            success : function(result){
                alert(result);
            }
            
        });
            
            //getAllBooks();
            
            /*$.ajax({
            url: "http://192.168.1.19/api/all",
            contentType: "application/json",
            type: "Get",
            success: function (data) { 
                alert(JSON.stringify(data));
            },
            error: function (msg) { 
                alert(JSON.stringify(msg)); 
            }
            });*/
            
            /*$.getJSON("http://192.168.1.19/api/all", function(result){
                alert("result: "+JSON.stringify(result));
            });*/
            
            /*
            return $http({
              method: 'GET',
              url: 'http://192.168.1.19:8080/api/all'
            });*/
            //return $http.get('http://localhost:5000/api/values');
            //return $http.get("http://192.168.1.19/api/all/12");
            //return $http.get('http://192.168.1.19:8080/api/all').then(handleSuccess, handleError('Error getting user by id'));
        }
        
        
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
            //$window.alert("data:");
            
            var deferred = $q.defer();
            
            fire.child("jobs/"+id).remove(function(error) {
                if(error)
                    deferred.reject(error);
                else{
                    //deferred.resolve();
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
            
            //$window.alert(JSON.stringify(job));
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
                //$window.alert("works: "+JSON.stringify(snapshot.val()));
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

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }
        
        function Register(user){
            var deferred = $q.defer();
            
            if(user.teacher){
                fire.child("keys").orderByChild("Key").equalTo(user.code).once("value", function(snapshot) {
                    var code = snapshot.val();
                    //alert("code: "+JSON.stringify(key));
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
                    //console.log("Error creating user:", error);
                    //$window.alert("error "+error);
                  } else {
                    //console.log("Successfully created user account with uid:", userData.uid);
                    //$window.alert("ok! "+JSON.stringify(userData));
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
            //return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
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
                //console.log("Login Failed!", error);
              } else {
                //$window.alert("ok! "+JSON.stringify(authData));
                deferred.resolve({success: true, authdata: authData});
                //console.log("Authenticated successfully with payload:", authData);
                //$window.alert("ok! "+authData.uid);
              }
            });
            
            return deferred.promise;

        }

        // private functions

        function handleSuccess(res) {
            $window.alert("res: "+JSON.stringify(res));
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
