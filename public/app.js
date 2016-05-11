(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })
            
            .when('/profile', {
                controller: 'ProfileController',
                templateUrl: 'profile/profile.view.html',
                controllerAs: 'vm'
            })
            
            .when('/addwork', {
                controller: 'AddWorkController',
                templateUrl: 'addwork/addwork.view.html',
                controllerAs: 'vm'
            })
        
            .when('/work/create', {
                controller: 'WorkEditController',
                templateUrl: 'work/workedit.view.html',
                controllerAs: 'vm'
            })
            
            .when('/work/edit/:id', {
                controller: 'WorkEditController',
                templateUrl: 'work/workedit.view.html',
                controllerAs: 'vm'
            })
        
            .when('/work/:id', {
                controller: 'WorkController',
                templateUrl: 'work/work.view.html',
                controllerAs: 'vm'
            })
        
            .when('/job/:id',{
                controller: 'JobController',
                templateUrl: 'job/job.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http','$window','ApiService'];
    function run($rootScope, $location, $cookieStore, $http, $window, ApiService) {
        
        $rootScope.$on('$locationChangeStart', function (event, next, current) {

            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            
            var authData = ApiService.fire.getAuth();
            
            if (restrictedPage && !authData) {
              $location.path('/login');
            }
            
        });
        
    }

})();