(function() {
    'use strict';

    angular.module('app').config(['$routeProvider', ', $locationProvider', routes]);

    function routes($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/homepage.html'
            })
            .when('/graphs/class', {
                templateUrl: 'templates/class-diagram.html'
            })
            .when('/classes', {
                templateUrl: 'templates/class-list.html',
                controller: 'ClassDetail',
                controllerAs: 'class_detail'
            })
            .when('/classes/:class*', {
                templateUrl: 'templates/class-detail.html',
                controller: 'ClassDetail',
                controllerAs: 'class_detail'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }
})();
