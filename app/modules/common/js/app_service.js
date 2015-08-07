(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('AppService', AppService);

    AppService.$inject = ['Config'];

    function AppService(Config)
    {
        //
        // Private members
        //
        var _service = this;
        var topBarTitle = Config.appName;

        //
        // Public members
        //
        _service.getTopBarTitle = _getTopBarTitle;
        _service.setTopBarTitle = _setTopBarTitle;


        //
        // PRIVATE METHODS
        //
        /**
         * Set the top bar title
         * @param val String
         */
        function _setTopBarTitle(val)
        {
            topBarTitle = val;
        }

        /**
         * Return the top bar title
         * @returns {*}
         */
        function _getTopBarTitle()
        {
            return topBarTitle;
        }


        //
        // PUBLIC API
        //
        return _service;
    }
})();