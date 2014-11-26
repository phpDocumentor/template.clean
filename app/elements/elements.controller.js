(function() {
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
})();