(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('AppBaseService', AppBaseService);

    AppBaseService.$inject = ['BaseService', 'LocalStorageService'];

    function AppBaseService(BaseService, LocalStorageService)
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
        /**
         * AppBaseService constructor
         * @param Api
         * @param options
         */
        _service.appBaseService = function(Api, options)
        {
            BaseService.ListKeyService.call(this, Api, options);
        };
        _service.appBaseService.prototype = Object.create(BaseService.ListKeyService.prototype);

        /**
         * Custom implementation of BaseService getList
         * This implementation permit to set only the listKey in params
         * @param listKey
         */
        _service.appBaseService.prototype.displayList = function(listKey)
        {
            return this.getList(undefined, undefined, listKey);
        };

        /**
         * Custom implementation of the BaseService filterize method
         * This implementation permit to handle a fallback when data is not reachable
         * This fallback looks in the App LocalStorage to find an old version of items and add it to the list.
         * @param params
         * @param cb
         * @param errCb
         * @param listKey
         */
        _service.appBaseService.prototype.inAppFilter = function(params, cb, errCb, listKey)
        {
            var _self = this;

            return this.filterize(params, function success(items)
            {
                // Put the data list in the localStorage
                LocalStorageService.setData(listKey, items);
                cb(items);
            }, function error(err)
            {
                // If no data is founded, check if a list is already defined
                // If not, get the localStorage data and replace the items list
                if (LocalStorageService.getKey(listKey) && !_self.displayList(listKey).length)
                {
                    var items = LocalStorageService.getData(listKey);
                    if(angular.isDefined(items) && items.length)
                    {
                        _self.displayList(listKey).push.apply(_self.displayList(listKey), items);
                    }
                }
                errCb(err);
            }, listKey);
        };


        //
        // PRIVATE METHODS
        //
        /**
         * AppBaseService method to create the custom base service
         * @param Api
         * @param options
         * @returns {AppBaseService.appBaseService}
         */
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