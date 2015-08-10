(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Controllers')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['AppService', 'Translation'];

    function HomeController(AppService, Translation)
    {
        var vm = this;

        // PUBLIC MEMBERS
        vm.welcomeMessage = 'Hello World';


        //
        // PRIVATE METHODS
        //
        function _init()
        {
            AppService.setTopBarTitle(Translation.translate('HOME'));
        }


        //
        // INITIALIZATION
        //
        _init();
    }
})();
