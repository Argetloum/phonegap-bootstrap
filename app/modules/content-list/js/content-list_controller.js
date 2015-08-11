(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Controllers')
        .controller('ContentListController', ContentListController);

    ContentListController.$inject = ['$timeout', 'AppService', 'Translation', 'Utils', 'Content'];

    function ContentListController($timeout, AppService, Translation, Utils, Content)
    {
        var vm = this;

        // PUBLIC MEMBERS
        vm.refresh = _refresh;
        vm.listKey = 'contentList.content'; // The list key must be prefixed by the controller name to be unique

        //
        // PRIVATE METHODS
        //
        function _init()
        {
            AppService.setTopBarTitle(Translation.translate('NEWS'));

            // Example to get items from an API
            Content.inAppFilter({ param1: 'value' }, function success(items)
            {
                // Possible action to do after retrieving items
            }, function error(err)
            {
                // We can't use a LxNotification for now until this feature doesn't need jQuery
                // Utils.displayServerError(err);
            }, vm.listKey);
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
