(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('LocalStorageService', LocalStorageService);

    LocalStorageService.$inject = ['$localStorage'];

    function LocalStorageService($localStorage)
    {
        //
        // Private members
        //
        var _service = this;

        //
        // Public members
        //
        _service.setData = _setData;
        _service.getData = _getData;
        _service.getKey = _getKey;
        _service.reset = _reset;


        //
        // PRIVATE METHODS
        //
        /**
         * Set data in the local storage
         * @param key String
         * @param data array
         */
        function _setData(key, data)
        {
            $localStorage[key] = data;
        }

        /**
         * Return data from the local storage
         * @param key String
         * @returns {*}
         */
        function _getData(key)
        {
            if (angular.isDefined($localStorage[key]))
            {
                return $localStorage[key];
            }
        }

        /**
         * Return data from the local storage
         * @param key String
         * @returns {*}
         */
        function _getKey(key)
        {
            return angular.isDefined($localStorage[key]);
        }

        /**
         * Reset localStorage
         */
        function _reset()
        {
            $localStorage.$reset();
        }

        //
        // PUBLIC API
        //
        return _service;
    }
})();