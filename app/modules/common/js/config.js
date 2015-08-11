(function()
{
    /* global angular */
    /* global location */
    'use strict'; // jshint ignore:line

    angular
        .module('Constants')
        .constant('Config', {
            // APPLICATION CONSTANTS
            APPLICATION_NAME: 'Mobile App',

            // LOCATION CONSTANTS
            APPLICATION_HOST: angular.isDefined(location) && angular.isDefined(location.host) && location.host.indexOf('-dot-') !== -1 ? 'https://' + location.host : 'http://localhost:8888',

            // API CONSTANTS
            API_BASE_URL: '/_ah/api/lumsites/v1'
        });
})();