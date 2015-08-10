(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Controllers')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['AppService'];

    function SidebarController(AppService)
    {
        var vm = this;

        //
        // PUBLIC MEMBERS
        //
        vm.handleSidebarLink = _handleSidebarLink;


        //
        // PRIVATE METHODS
        //
        /**
         * Toggle the sidebar when a click is done on a sidebar link
         */
        function _handleSidebarLink()
        {
            AppService.toggleSidebar('left');
        }
    }
})();
