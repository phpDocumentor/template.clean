(function() {
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
