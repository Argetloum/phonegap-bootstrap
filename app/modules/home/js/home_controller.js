(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl()
    {
        var vm = this;

        vm.welcomeMessage = 'Hello World';
    }
})();
