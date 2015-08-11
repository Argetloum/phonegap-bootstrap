(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Factories')
        .factory('ContentFactory', ContentFactory);

    ContentFactory.$inject = ['$resource', 'Config'];

    function ContentFactory($resource, Config)
    {
        return $resource(Config.APPLICATION_HOST + Config.API_BASE_URL + '/content/:methodKey', {},
            {
                get: {method: 'GET', params: {methodKey: 'get'}, isArray: false},
                list: {method: 'GET', params: {methodKey: 'list'}, isArray: false}
            });
    }
})();
