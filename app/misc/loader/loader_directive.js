(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Directives')
        .directive('loader', loader);

    function loader()
    {
        var directive = {
            restrict: 'E',
            templateUrl: 'misc/loader/views/loader.html',
            replace: true,
            scope: {
                type: '@?'
            },
            compile: function(element, attrs)
            {
                if (!attrs.type)
                {
                    attrs.type = 'circular';
                }
            }
        };

        return directive;
    }
})();
