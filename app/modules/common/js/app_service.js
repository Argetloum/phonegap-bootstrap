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
        var topBarTitle = Config.APPLICATION_NAME;
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
         * @param direction: optional - if a direction is specified, handle it
         */
        function _toggleSidebar(direction)
        {
            if (angular.isDefined(direction))
            {
                if(sidebarIsShown && direction === 'left')
                {
                    sidebarIsShown = !sidebarIsShown;
                }
                else if(!sidebarIsShown && direction === 'right')
                {
                    sidebarIsShown = !sidebarIsShown;
                }
            }
            else
            {
                sidebarIsShown = !sidebarIsShown;
            }
        }


        //
        // PUBLIC API
        //
        return _service;
    }
})();