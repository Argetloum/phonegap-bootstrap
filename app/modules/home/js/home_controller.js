(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Controllers')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl()
    {
        var vm = this;

        vm.welcomeMessage = 'Hello World';
    }
})();
