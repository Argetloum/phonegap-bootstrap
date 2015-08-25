(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Filters')
        .filter('truncate', TruncateFilter);

    function TruncateFilter()
    {
        /**
         * Truncate Filter
         * @param {String} string
         * @param {Integer} length - Default is 200
         * @param {String} truncation - Default is "..."
         * @param {Boolean} useWordBoundary - Default is true
         * @returns {Function}
         */
        return function(string, length, truncation, useWordBoundary)
        {
            if (angular.isDefined(string))
            {
                length = length || 200;
                truncation = _.isUndefined(truncation) ? '...' : truncation;
                useWordBoundary = _.isUndefined(useWordBoundary) ? true : useWordBoundary;
                var toLong = string.length > length;
                var s_ = toLong ? string.substr(0, length - 1) : string;
                s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
                return toLong ? s_ + truncation : s_;
            }
            else
            {
                return '';
            }
        };
    }


    angular
        .module('Filters')
        .filter('stripTags', StripTagsFilter);

    StripTagsFilter.$inject = ['Utils'];

    function StripTagsFilter(Utils)
    {
        /**
         * StripTags Filter
         * @param {String} text
         * @returns {String}
         */
        return function(text)
        {
            if (angular.isDefined(text))
            {
                return Utils.stripTags(text);
            }
            else
            {
                return text;
            }
        };
    }


    angular
        .module('Filters')
        .filter('slice', SliceFilter);

    function SliceFilter()
    {
        /**
         * Slice Filter
         * @param {Array} arr
         * @param {Integer} start
         * @param {Integer} end - optionnal
         * @returns {Array}
         */
        return function(arr, start, end)
        {
            if (angular.isDefined(end))
            {
                return (arr || []).slice(start, end);
            }
            else
            {
                return (arr || []).slice(start);
            }
        };
    }

})();