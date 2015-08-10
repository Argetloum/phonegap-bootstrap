(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Controllers')
        .controller('ContentListController', ContentListController);

    ContentListController.$inject = ['$timeout', 'AppService', 'Translation'];

    function ContentListController($timeout, AppService, Translation)
    {
        var vm = this;

        // PUBLIC MEMBERS
        vm.refresh = _refresh;

        //
        // PRIVATE METHODS
        //
        function _init()
        {
            AppService.setTopBarTitle(Translation.translate('NEWS'));
        }

        /**
         * Refresh data
         */
        function _refresh(cb)
        {
            // Example code
            // You need to execute the callback to hide the refresh icon
            if (angular.isDefined(cb))
            {
                $timeout(function()
                {
                    cb();
                }, 2000);
            }
        }


        //
        // INITIALIZATION
        //
        _init();
    }
})();
