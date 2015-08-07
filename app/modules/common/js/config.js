(function()
{
    /* global angular */
    /* global LOCALE */
    /* global navigator */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('Config', Config);

    function Config()
    {
        //
        // Private members
        //
        var _service = this;
        var locale = navigator.language !== null ? navigator.language : navigator.browserLanguage;

        //
        // Public members
        //
        _service.getLocale = _getLocale;


        //
        // PRIVATE METHODS
        //
        /**
         * Get the client locale.
         *
         * @return  {String}  The locale.
         */
        function _getLocale()
        {
            return LOCALE ? LOCALE : locale;
        }


        //
        // PUBLIC API
        //
        return _service;
    }
})();