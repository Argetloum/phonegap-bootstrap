(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Controllers')
        .controller('ContentListController', ContentListController);

    ContentListController.$inject = ['AppService', 'Translation'];

    function ContentListController(AppService, Translation)
    {
        var vm = this;


        //
        // PRIVATE METHODS
        //
        function _init()
        {
            AppService.setTopBarTitle(Translation.translate('NEWS'));
        }


        //
        // INITIALIZATION
        //
        _init();
    }
})();
