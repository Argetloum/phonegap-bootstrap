(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Directives')
        .directive('noResults', noResults);

    function noResults()
    {
        return {
            restrict: 'E',
            templateUrl: 'misc/no-results/views/no-results.html',
            replace: true
        };
    }
})();