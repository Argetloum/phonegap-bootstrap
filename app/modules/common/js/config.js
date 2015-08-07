/* global LOCALE */
/* global navigator */

'use strict'; // jshint ignore:line

angular.module('Services')
    .service('Config', ['$interval', '$rootScope', function($interval)
    {
        //
        // Locale management
        //
        var locale = navigator.language !== null ? navigator.language : navigator.browserLanguage;

        /**
         * Get the client locale.
         *
         * @return  {String}  The locale.
         */
        function getLocale()
        {
            return LOCALE ? LOCALE : locale;
        }

        return {
            getLocale: getLocale
        };
    }]);
