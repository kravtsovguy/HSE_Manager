(function () {
    'use strict';

    angular
        .module('app')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$http','$window','$q'];
    function ApiService($http,$window,$q) {
        
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
        service.authdata = fire.getAuth();

        return service;
        
        function GetJobs(workid){
            var deferred = $q.defer();

            fire.child("jobs").orderByChild("work").equalTo(workid).on("value", function(snapshot) {
                deferred.resolve(snapshot.val());
            }, function (errorObject) {
                deferred.reject();
            });
            
            return deferred.promise;
        }
        
        function AddJob(job,file){
            var deferred = $q.defer();
            
            //$window.alert(JSON.stringify(job));
            if(file){
            var jpush = fire.child("jobs").push();
            jpush.set(job, function(error) {
                fire.child("files/"+jpush.key()).set({file:file}, function (error2){
                    deferred.resolve(error2);
                });
            });
            }
            
            return deferred.promise;
        }
        
        function GetWork(id){
            var deferred = $q.defer();
            fire.child("works/"+id).on("value", function(snapshot) {
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
            
            fire.child("works").on("value", function(snapshot) {
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
                    deferred.resolve({ success: true, userData: userData });
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
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
