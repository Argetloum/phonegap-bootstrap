(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('AppBaseService', AppBaseService);

    AppBaseService.$inject = ['BaseService'];

    function AppBaseService(BaseService)
    {
        //
        // Private members
        //
        var _service = this;

        //
        // Public members
        //
        _service.createAppBaseService = _createAppBaseService;


        //
        // Implementation of Base Service extension
        //
        _service.appBaseService = function(Api, options)
        {
            BaseService.ListKeyService.call(this, Api, options);
        };

        _service.appBaseService.prototype = Object.create(BaseService.ListKeyService.prototype);

        _service.appBaseService.prototype.displayList = function(listKey)
        {
            return this.getList(undefined, undefined, listKey);
        };


        //
        // PRIVATE METHODS
        //
        function _createAppBaseService(Api, options)
        {
            return new _service.appBaseService(Api, options);
        }


        //
        // PUBLIC API
        //
        return _service;
    }
})();