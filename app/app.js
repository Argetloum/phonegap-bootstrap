var APPLICATION_NAME = 'mobile-app';

(function()
{
    /* global angular */

    // Use theses modules to declare new filters, services, factories and directives
    // so the injector is automatically available
    angular.module('Constants', []);
    angular.module('Filters', []);
    angular.module('Directives', []);
    angular.module('Factories', ['ngResource']);
    angular.module('Services', []);
    angular.module('ModulesTemplates', []);
    angular.module('Controllers', []);

    angular.module(APPLICATION_NAME,
        [
            'translation',
            'ngResource',
            'ui.router',
            'ngStorage',
            'Controllers',
            'Directives',
            'Constants',
            'Factories',
            'Filters',
            'Services',
            'ModulesTemplates'
        ])

        .config(function($locationProvider, $stateProvider, $urlRouterProvider)
        {
            $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
            });

            $stateProvider
                // setup an abstract state for the tabs directive
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'modules/common/views/default.html'
                })

                // Each tab has its own nav history stack:
                .state('app.home', {
                    url: '/home',
                    views: {
                        'content': {
                            templateUrl: 'modules/home/views/home.html',
                            controller: 'HomeCtrl'
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');

        })
        .run(['$rootScope', '$timeout', 'Translation', 'GlobalizationService',
            function($rootScope, $timeout, Translation, GlobalizationService)
            {
                $rootScope.Translation = Translation;

                document.addEventListener('deviceready', function()
                {
                    // Get the device language & set it to the translation service
                    GlobalizationService.init();
                }, true);
            }
        ]);
})();