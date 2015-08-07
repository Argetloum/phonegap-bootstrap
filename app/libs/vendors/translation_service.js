'use strict';

/**
 * Translation Service
 * Allow to translate a string using pascalprecht angular translate module or using an array of string
 *
 * You must have angular-translate (pascalprecht.translate) module available to use this service
 * Remember to declare your language in angular-translate:
 *      $translateProvider.translations('<langCode: en/fr/es, ...>',
 *      {
 *          // Your translations here
 *      };
 *
 * Remember also to set a default, preferred and fallback language:
 *      // Set the preferred language the same that the browser language
 *      $translateProvider.preferredLanguage((navigator.language != null ? navigator.language : navigator.browserLanguage).split("_")[0].split("-")[0]);
 *      // Default language to display of any other is not available
 *      $translateProvider.fallbackLanguage('en');
 *
 *
 * You can then use this service to translate an array containing languages (content['en'] = 'Test English'; content['fr'] = 'Test Français'), or an angular-translate token ('SITE_TITLE').
 */
angular.module('translation', ['pascalprecht.translate']).service('Translation', ['$translate', function($translate)
{
    /**
     * Register a dict in the Translation singleton in which it will search the keys to translate.
     *
     * @param {object} dict A dict Keys => Dict[locale => translation]
     */
    this.registerTranslationsDict = function(dict)
    {
        this.translationsDict = dict;
    };

    /**
     * Find the translation for the wanted language in the content object.
     *
     * @param {object} content A dict Locale => translation.
     * @param {string} defaultText The default text in case we don't find the lang.
     * @param {string} lang The lang to translate to.
     * @return {string} The translation
     */
    this.__translateFromObject = function(content, defaultText, lang)
    {
        var currentLang = (lang && lang.length > 0) ? lang : $translate.use();
        var preferredLang = $translate.preferredLanguage();
        var fallbackLang = $translate.fallbackLanguage();

        if (currentLang in content && content[currentLang] && content[currentLang].length > 0)
        {
            return content[currentLang];
        }
        else if (preferredLang in content && content[preferredLang] && content[preferredLang].length > 0)
        {
            return content[preferredLang];
        }
        else if (fallbackLang in content && content[fallbackLang] && content[fallbackLang].length > 0)
        {
            return content[fallbackLang];
        }
        else
        {
            // Return other lang if there is one with a value
            for (var idx in content)
            {
                if (content[idx] && content[idx].length > 0)
                {
                    return content[idx];
                }
            }
        }

        if(defaultText && defaultText.length > 0)
        {
            return this.translate(defaultText, '', lang);
        }

        // Return at least a string
        return '';
    };

    /**
     * Translates a content
     * If the content is a string, try to translate it automatically with the $translate provider
     * Else, check if any of the language (in use, preferred and fallback) exists in the object and use it for the translation
     * If there is no translation for any of these 3 languages, display a default text
     *
     * @param content The content to translate. Either an array/dict of text indexed by the language or a string
     * @param defaultText The text to use in case of a missing translation
     * @param lang If specified, the lang in which we want the translation
     * @return The translation as a string
     */
    this.translate = function(content, defaultText, lang)
    {
        var translation = '';

        if (content)
        {
            if(Object.prototype.toString.call(content) !== '[object String]')
            {
                return this.__translateFromObject(content, defaultText, lang);
            }
            else
            {
                var oldLang = $translate.use();
                var currentLang = (lang && lang.length > 0) ? lang : $translate.use();
                if (currentLang != oldLang)
                {
                    $translate.use(currentLang);
                }

                translation = $translate.instant(content);

                if (currentLang != oldLang)
                {
                    $translate.use(oldLang);
                }

                if(this.translationsDict && content in this.translationsDict &&
                   this.translationsDict[content])
                {
                    return this.__translateFromObject(this.translationsDict[content],
                                                      !translation || translation === '' ? defaultText : translation,
                                                      lang);
                }
            }
        }

        return translation;
    };

    /**
     * Returns the different type of languages defined on the app
     *
     * @param type The language type we want to get. Either 'current', 'preferred'/'default' or 'fallback'. If no type is given, then an array with all the languages is returned.
     * @return The language(s) in use. Either a string (if a type is provided) or an array of all languages indexed by the language type ('current', 'preferred', 'fallback' or 'default')
     */
    this.getLang = function(type)
    {
        switch (type)
        {
            case 'current':
                return $translate.use();

            case 'preferred':
            case 'default':
                return $translate.preferredLanguage();

            case 'fallback':
                return $translate.fallbackLanguage();

            default:
                var languages = [];
                languages['current'] = getLanguage('current');
                languages['default'] = getLanguage('preferred');
                languages['fallback'] = getLanguage('fallback');

                return languages;
        }
    };

    /**
     * Set the language for the application
     *
     * @param type The language type we want to set. Either 'current', 'preferred'/'default' or 'fallback'
     * @param lang the lang to set.
     */
    this.setLang = function(type, lang)
    {
        switch (type)
        {
            case 'current':
                $translate.use(lang);
                break;

            case 'preferred':
            case 'default':
                $translate.preferredLanguage(lang);
                break;

            case 'fallback':
                $translate.fallbackLanguage(lang);
                break;
        }
    };
}]);