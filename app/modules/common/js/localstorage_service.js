'use strict'; // jshint ignore:line

angular.module('Services')
    .service('LocalStorageService', ['$localStorage', function($localStorage)
    {

        /**
         * Set data in the local storage
         * @param key String
         * @param data array
         */
        function setData(key, data)
        {
            $localStorage[key] = data;
        }

        /**
         * Return data from the local storage
         * @param key String
         * @returns {*}
         */
        function getData(key)
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
        function getKey(key)
        {
            return angular.isDefined($localStorage[key]);
        }

        /**
         * Reset localStorage
         */
        function reset()
        {
            $localStorage.$reset();
        }


        return {
            setData: setData,
            getData: getData,
            getKey: getKey,
            reset: reset
        };
    }]);