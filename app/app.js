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
    angular.module('MiscTemplates', []);
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
            'ModulesTemplates',
            'MiscTemplates',
            'ngTouch',
            'hj.uiSrefFastclick',
            'toolkit.base_service'
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
                    views: {
                        'sidebar': {
                            controller: 'SidebarController',
                            controllerAs: 'vm',
                            templateUrl: 'modules/layout/sidebar/views/sidebar.html'
                        },
                        'app': {
                            templateUrl: 'modules/layout/app/views/app.html'
                        }
                    }
                })

                // Each tab has its own nav history stack:
                .state('app.home', {
                    url: '/home',
                    views: {
                        'content': {
                            templateUrl: 'modules/home/views/home.html',
                            controller: 'HomeController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.content-list', {
                    url: '/content-list',
                    views: {
                        'content': {
                            templateUrl: 'modules/content-list/views/content-list.html',
                            controller: 'ContentListController',
                            controllerAs: 'vm'
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');

        })
        .run(['$rootScope', '$timeout', 'Translation', 'GlobalizationService', 'AppService',
            function($rootScope, $timeout, Translation, GlobalizationService, AppService)
            {
                $rootScope.Translation = Translation;
                $rootScope.AppService = AppService;

                document.addEventListener('deviceready', function()
                {
                    // Get the device language & set it to the translation service
                    GlobalizationService.init();
                }, true);
            }
        ]);
})();