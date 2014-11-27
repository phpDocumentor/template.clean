(function() {
    'use strict';

    angular.module('app').config(['$routeProvider', routes]);

    function routes($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/homepage.html'
            })
            .when('/graphs/class', {
                templateUrl: 'templates/class-diagram.html'
            })
            .when('/namespaces/:namespace*', {
                templateUrl: 'templates/namespace-detail.html',
                controller: 'NamespaceDetail',
                controllerAs: 'namespace_detail'
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
    }
})();
