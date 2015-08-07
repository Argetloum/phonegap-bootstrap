/* global angular */
/* global navigator */
'use strict'; // jshint ignore:line

angular.module('Services')
    .service('GlobalizationService', ['Utils', 'Translation', function(Utils, Translation)
    {

        var preferredLanguage = 'en';

        function init()
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


        function getPreferredLang()
        {
            return preferredLanguage;
        }

        return {
            init: init,
            getPreferredLang: getPreferredLang
        };
    }]);