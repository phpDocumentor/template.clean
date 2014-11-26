$(document).foundation();
;(function() {
    'use strict';

    angular.module('app', ['ngRoute', 'ngSanitize', 'markdown']);
})();
;(function() {
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
;(function() {
    'use strict';

    angular.module('app').filter('route', routeFilter);

    function routeFilter() {
        return function(fqsen, existingClasses) {
            var fqsenParts = fqsen.split('::');
            var fqcn = fqsenParts[0];
            var elementName = fqsenParts[1];

            if (! $.inArray(fqcn, existingClasses)) {
                return fqsen;
            }

            // TODO: add support for elementNames to scroll directly to a method, property or constant
            return 'classes/' + fqcn.split('\\').join('.').substr(1);
        };
    }
})();
;(function() {
    'use strict';

    angular.module('app').controller('Elements', Elements);

    Elements.$inject = ['$http', '$timeout'];

    function Elements($http, $timeout) {
        var vm = this;

        vm.packages = null;
        vm.namespaces = null;
        vm.classes = [];

        function extractClassListing(namespaceObject) {
            if (namespaceObject.classes) {
                $.each(namespaceObject.classes, function (key, className) {
                    vm.classes.push(className);
                });
            }
            if (namespaceObject.interfaces) {
                $.each(namespaceObject.interfaces, function (key, className) {
                    vm.classes.push(className);
                });
            }
            if (namespaceObject.traits) {
                $.each(namespaceObject.traits, function (key, className) {
                    vm.classes.push(className);
                });
            }
            if (namespaceObject.namespaces) {
                $.each(namespaceObject.namespaces, function (key, namespace) {
                    extractClassListing(namespace);
                });
            }
        }

        // because Angular requires the callback name to be dynamic and we can't do that we override the
        // window.classDefinition method because that is the name of the callback we defined in the JSON file.
        // Thanks to this we can still intercept the JSONP payload, even though we technically do not use the
        // normal Angular mechanism.
        //
        // Downside to this action is that Angular will always think that the JSONP call has failed; so the only
        // way to verify if it really failed is by checking whether the vm.namespaces variable is null.
        window.namespaces = function(data) {
            vm.namespaces = data;
            extractClassListing(vm.namespaces);
        };
        window.packages = function(data) {
            vm.packages = data;

            // todo move this somewhere else; the navigation is not necessarily tied to this controller.
            $timeout(function(){mtree(jQuery); }, 1);
        };

        $http.jsonp("namespaces.json");
        $http.jsonp("packages.json");
    }
})();;(function() {
    'use strict';

    angular.module('app').controller('ClassDetail', classDetail);

    classDetail.$inject = ['$http', '$routeParams', '$location', 'filterFilter'];

    function classDetail($http, $routeParams, $location, filterFilter) {
        var vm = this;
        vm.class = null;

        // because Angular requires the callback name to be dynamic and we can't do that we override the
        // window.classDefinition method because that is the name of the callback we defined in the JSON file.
        // Thanks to this we can still intercept the JSONP payload, even though we technically do not use the
        // normal Angular mechanism.
        //
        // Downside to this action is that Angular will always think that the JSONP call has failed; so the only
        // way to verify if it really failed is by checking whether the $scope.doc variable is null.
        window.classDefinition = function(data) {
            vm.class = data;
            vm.class.public_methods = filterFilter(data.methods, {visibility: 'public'});
            vm.class.protected_methods = filterFilter(data.methods, {visibility: 'protected'});
            vm.class.private_methods = filterFilter(data.methods, {visibility: 'private'});
            vm.class.public_properties = filterFilter(data.properties, {visibility: 'public'});
            vm.class.protected_properties = filterFilter(data.properties, {visibility: 'protected'});
            vm.class.private_properties = filterFilter(data.properties, {visibility: 'private'});
        };

        $http.jsonp("classes/"+$routeParams["class"].split('/').join('.')+".json")
            .error(
            function() {
                // only if vm.class is null did a real error occur; because of the window.classDefinition hack is
                // this error always triggered. Even when successful.
                if (vm.class === null) {
                    $location.path("/");
                }
            }
        );
    }
})();
