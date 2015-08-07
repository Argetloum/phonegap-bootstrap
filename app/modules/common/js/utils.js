/* global Date */
/* global Math */
/* global $ */
/* global angular */
/* global jQuery */
'use strict'; // jshint ignore:line

angular.module('Services')
    .service('Utils', function ()
    {
        //
        // PUBLIC METHODS
        //

        function generateUUID()
        {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
            {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        }


        /**
         * Copy object to existing one
         * @param {Object} from - The object to copy
         * @param {Object} to - The destination object
         * @param {Boolean} setDefaultValue - Add a verification
         */
        function copyObjectToExistingOne(from, to, setDefaultValue)
        {
            $.each(to, function(key)
            {
                if(angular.isUndefined(setDefaultValue))
                {
                    to[key] = undefined;
                }
            });

            $.each(from, function(key)
            {
                if (jQuery.type(from[key]) === 'object')
                {
                    if (jQuery.type(to[key]) !== 'object')
                    {
                        to[key] = {};
                    }

                    copyObjectToExistingOne(from[key], to[key]);
                }
                else if (jQuery.type(from[key]) === 'array')
                {
                    to[key] = $.extend(true, [], from[key]);
                }
                else
                {
                    to[key] = from[key];
                }
            });
        }

        /**
         * Generate an easy random password
         * @param length the wanted length of the password
         */
        function generatePassword(length)
        {
            length = length || 8;
            var char = "abcdefghijklmnopqrstuvwxyz";
            var digit = "123456789";
            var authorizedChar = char + char.toUpperCase() + digit;
            var password = '';

            for (var idx = 0; idx < length; idx++)
            {
                password += authorizedChar.charAt(Math.floor(Math.random()*authorizedChar.length));
            }

            return password;
        }

        /**
         * Slugify a text
         * @param {String} value - The text to slugify
         * @returns {String}
         * @see original script available at http://goo.gl/48zuCd
         */
        function slugify(value)
        {
            if (!value)
            {
                return '';
            }

            var rExps = [
                {re: /[\xC0-\xC6]/g, ch: 'A'},
                {re: /[\xE0-\xE6]/g, ch: 'a'},
                {re: /[\xC8-\xCB]/g, ch: 'E'},
                {re: /[\xE8-\xEB]/g, ch: 'e'},
                {re: /[\xCC-\xCF]/g, ch: 'I'},
                {re: /[\xEC-\xEF]/g, ch: 'i'},
                {re: /[\xD2-\xD6]/g, ch: 'O'},
                {re: /[\xF2-\xF6]/g, ch: 'o'},
                {re: /[\xD9-\xDC]/g, ch: 'U'},
                {re: /[\xF9-\xFC]/g, ch: 'u'},
                {re: /[\xC7-\xE7]/g, ch: 'c'},
                {re: /[\xD1]/g, ch: 'N'},
                {re: /[\xF1]/g, ch: 'n'}
            ];

            for (var i = 0, len = rExps.length; i < len; i++)
            {
                value = value.replace(rExps[i].re, rExps[i].ch);
            }

            return value.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/\-{2,}/g, '-');
        }

        /**
         * Return the array with only unique objects, following their ids
         * @param {Array} array
         * @param {String} param - The param is not necessary, it specifies if we want to sort by a specific param or not
         * @returns {Array}
         */
        function arrayUnique(array, param)
        {
            var a = array.concat();

            for (var i = 0; i < a.length; ++i)
            {
                for (var j = i + 1; j < a.length; ++j)
                {
                    if (angular.isDefined(param))
                    {
                        if (a[i][param] === a[j][param])
                        {
                            a.splice(j--, 1);
                        }
                    }
                    else
                    {
                        if (a[i] === a[j])
                        {
                            a.splice(j--, 1);
                        }
                    }
                }
            }

            return a;
        }

        /**
         * Mobile log
         */
        function log(text)
        {
            console.log(JSON.stringify(text));
        }

        /**
         * Return true if all lang values are empty
         * @param {Array|Object} langArray - The lang array
         * @returns {Boolean}
         */
        function isLangArrayEmpty(langArray)
        {
            for (var lang in langArray)
            {
                if (angular.isDefined(langArray[lang]) && langArray[lang] !== '')
                {
                    return false;
                }
            }

            return true;
        }

        /**
         * Take a string and create an excerpt from it, returning an object
         * with the summary and body properties,
         * @param {Object} str - the string to shorten
         * @param {Object} limit - the limit of characters
         */
        function createExcerpt(str, limit)
        {
            str = String(str).replace(/<[^>]+>/gm, '');
            str = str.substr(0, str.lastIndexOf(' ', limit)) + '...';

            return str;
        }

        /**
         * Convert octets to size in string
         * @param bytes
         * @returns {string}
         */
        function bytesToSize(bytes)
        {
            if (bytes == 0) return '0 Byte';
            var k = 1000;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        }

        return {
            copyObjectToExistingOne: copyObjectToExistingOne,
            generateUUID: generateUUID,
            generatePassword: generatePassword,
            slugify: slugify,
            arrayUnique: arrayUnique,
            isLangArrayEmpty: isLangArrayEmpty,
            log: log,
            createExcerpt: createExcerpt,
            bytesToSize: bytesToSize
        };
    });