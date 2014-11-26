(function() {
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
