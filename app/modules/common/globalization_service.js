(function()
{
    /* global angular */
    /* global navigator */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('GlobalizationService', GlobalizationService);

    GlobalizationService.$inject = ['Utils', 'Translation'];

    function GlobalizationService(Utils, Translation)
    {
        //
        // Private members
        //
        var _service = this;
        var preferredLanguage = 'en';

        //
        // Public members
        //
        _service.init = _init;
        _service.getPreferredLang = _getPreferredLang;


        //
        // PRIVATE METHODS
        //
        function _init()
        {
            Utils.log('Init Globalization service...');
            navigator.globalization.getPreferredLanguage(
                function(language)
                {
                    var lang = 'en';
                    // Parse language to get only shortcode
                    if (language.value.match(/\-/))
                    {
                        var aSplitted = language.value.split('-');
                        lang = aSplitted[0];
                    }

                    preferredLanguage = lang.toLowerCase();
                    Translation.setLang('preferred', preferredLanguage);
                    Utils.log('Preferred Language selected is: "' + preferredLanguage + '"');
                },
                function()
                {
                    // Error detected when trying to get the language
                    preferredLanguage = 'en';
                }
            );
        }


        function _getPreferredLang()
        {
            return preferredLanguage;
        }

        //
        // PUBLIC API
        //
        return _service;
    }
})();