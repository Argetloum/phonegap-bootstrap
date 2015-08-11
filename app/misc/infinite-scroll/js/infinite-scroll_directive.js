(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Directives')
        .directive('infiniteScroll', infiniteScroll);

    infiniteScroll.$inject = ['$document', '$window', '$timeout'];

    function infiniteScroll($document, $window, $timeout)
    {
        return {
            link: function(scope, element, attrs)
            {
                var doc = angular.element($document),
                    win = angular.element($window),
                    scrollIsActive = true,
                    timeout;

                var bindScroll = function()
                {
                    if (scrollIsActive)
                    {
                        if (angular.isDefined(attrs.infiniteScrollTarget))
                        {
                            if (target.scrollTop() + target.innerHeight() >= target[0].scrollHeight)
                            {
                                scrollIsActive = false;

                                scope.$apply(attrs.infiniteScroll);

                                timeout = $timeout(function()
                                {
                                    scrollIsActive = true;
                                }, 500);
                            }
                        }
                        else
                        {
                            if (win.scrollTop() + win.height() >= doc.height())
                            {
                                scrollIsActive = false;

                                scope.$apply(attrs.infiniteScroll);

                                timeout = $timeout(function()
                                {
                                    scrollIsActive = true;
                                }, 500);
                            }
                        }
                    }
                };

                var target;

                if (attrs.infiniteScrollTarget === 'true')
                {
                    target = element;
                }
                else
                {
                    target = angular.element(attrs.infiniteScrollTarget);
                }

                if (attrs.infiniteScrollTarget)
                {
                    target.bind('scroll', bindScroll);
                }
                else
                {
                    win.bind('scroll', bindScroll);
                }

                scope.$on('$destroy', function()
                {
                    if (attrs.infiniteScrollTarget)
                    {
                        target.unbind('scroll', bindScroll);
                    }
                    else
                    {
                        win.unbind('scroll', bindScroll);
                    }
                });
            }
        };
    }
})();