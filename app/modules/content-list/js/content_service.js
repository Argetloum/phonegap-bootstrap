(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('Content', Content);

    Content.$inject = ['AppBaseService', 'ContentFactory'];

    function Content(AppBaseService, Api)
    {
        //
        // Private members
        //
        var _service = AppBaseService.createAppBaseService(Api,
            {
                objectIdentifier: 'uid',
                autoInit: false
            });


        //
        // PUBLIC API
        //
        return _service;
    }
})();