(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Services')
        .service('AppService', AppService);

    AppService.$inject = ['Config'];

    function AppService(Config)
    {
        //
        // Private members
        //
        var _service = this;
        var topBarTitle = Config.appName;
        var sidebarIsShown = false;

        //
        // Public members
        //
        _service.getTopBarTitle = _getTopBarTitle;
        _service.setTopBarTitle = _setTopBarTitle;
        _service.isSidebarShown = _isSidebarShown;
        _service.toggleSidebar = _toggleSidebar;


        //
        // PRIVATE METHODS
        //
        /**
         * Set the top bar title
         * @param val String
         */
        function _setTopBarTitle(val)
        {
            topBarTitle = val;
        }

        /**
         * Return the top bar title
         * @returns {*}
         */
        function _getTopBarTitle()
        {
            return topBarTitle;
        }

        /**
         * Check if the sidebar is opened
         * @return Boolean
         */
        function _isSidebarShown()
        {
            return sidebarIsShown;
        }

        /**
         * Change sidebar state
         */
        function _toggleSidebar()
        {
            sidebarIsShown = !sidebarIsShown;
        }


        //
        // PUBLIC API
        //
        return _service;
    }
})();