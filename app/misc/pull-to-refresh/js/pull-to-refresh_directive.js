(function()
{
    /* global angular */
    'use strict'; // jshint ignore:line

    angular
        .module('Directives')
        .directive('pullToRefresh', pullToRefresh);

    pullToRefresh.$inject = ['$compile', '$document'];

    function pullToRefresh($compile, $document)
    {
        return {
            link: function(scope, element, attrs)
            {
                //
                // BASIC VARIABLES
                //
                var config = {
                    distanceToRefresh: 70, // the distance needed to execute a pull refresh
                    isTouched: false, // keep the state whether the fingers are touched
                    isMoved: false, // keep the state whether a pull actually went out
                    pullEnabled: false, // keep the state whether the pull action is enabled
                    prevY: null, // This has the original Top offset (relative to screen) position of the list
                    cssY: 0, // The base position of the pull to refresh icon
                    iconHeight: 0 // the current height of the pull icon
                };
                scope.pullState = '';
                var wrapper = angular.element('<div class="pull-to-refresh" />');
                var statusElem = angular.element('<header><i class="icon icon--m icon--flat mdi mdi-refresh"></i></header>');


                //
                // PRIVATE METHODS
                //
                /**
                 * Initialization function
                 * @private
                 */
                function _init()
                {
                    statusElem = $compile(statusElem)(scope);

                    element[0].parentNode.insertBefore(wrapper[0], element[0]);
                    wrapper.append(statusElem);
                    wrapper.append(element);

                    statusElem.css({
                        position: 'relative',
                        top: '-' + config.distanceToRefresh + 'px'
                    });

                    // T his has the original Top CSS position of the list
                    config.cssY = statusElem.css('top');
                    config.cssY = parseInt(config.cssY.substring(0, config.cssY.length - 2));

                    config.iconHeight = statusElem[0].offsetHeight;
                    element.css({
                        position: 'relative',
                        top: '-' + config.iconHeight + 'px'
                    });

                    _bindItems();
                }


                /**
                 * Detect the action of pulling down to move the container
                 * @param change
                 * @private
                 */
                function _pullingDown(change)
                {
                    if (change > 0 && config.pullEnabled)
                    {
                        if (change > config.distanceToRefresh)
                        {
                            scope.pullState = 'ready';
                        }
                        else
                        {
                            scope.pullState = change;
                        }
                        statusElem.css('top', config.cssY + change + 'px');
                        config.isMoved = true;
                        scope.$apply();
                    }
                }

                /**
                 * End of pulling. If the pulled element is upper than the config.distanceToRefresh,
                 * execute the refresh action
                 * @param change
                 */
                function _pullingStopped(change)
                {
                    var restoreCssY = config.cssY;
                    if (config.isMoved && change > config.distanceToRefresh)
                    {
                        restoreCssY += config.distanceToRefresh;
                        scope.pullState = 'refreshing';
                        scope.$apply();
                        _callRefreshFunction();
                    }
                    statusElem.css({
                        transition: 'top 1s',
                        top: restoreCssY + 'px'
                    });
                    config.isTouched = false;
                    config.isMoved = false;
                    config.pullEnabled = false;
                }

                /**
                 * Execute the refresh action
                 * Wait for the callback to hide the pulling icon
                 */
                function _callRefreshFunction()
                {
                    scope.$eval(attrs.pullToRefresh, {
                        cb: function()
                        {
                            statusElem.css({
                                transition: 'top 1s',
                                top: config.cssY + 'px'
                            });
                            scope.pullState = '';
                        }
                    });
                }

                /**
                 * Bind mouse and touch events to handle pullToRefresh
                 * @private
                 */
                function _bindItems()
                {
                    // Add the start of the touching
                    element.bind('touchstart', function(e)
                    {
                        // only enable pull to refresh at the top of the page
                        if ($document[0].body.scrollTop === 0)
                        {
                            config.pullEnabled = true;
                            config.isTouched = true;
                            // initialize the touched point
                            config.prevY = e.touches[0].clientY;
                            // we use css3 transitions when available for smooth sliding
                            statusElem.css('transition', '');
                        }
                    });

                    element.bind('touchend', function(e)
                    {
                        // on touchup we cancel the touch event
                        // now if the list has moved downwards, it should come up but in a transition
                        var change = e.changedTouches[0].clientY - config.prevY;
                        if (config.isTouched && change > 0)
                        {
                            _pullingStopped(change);
                        }
                    });

                    element.bind('touchmove', function(e)
                    {
                        var change = e.touches[0].clientY - config.prevY;
                        if (config.isTouched)
                        {
                            _pullingDown(change);
                        }
                    });


                    // binding mouse events to make this work in desktop browsers as well
                    element.bind('mousedown', function(e)
                    {
                        // only check left button click
                        if (e.button === 0 && $document[0].body.scrollTop === 0)
                        {
                            config.isTouched = true;
                            config.prevY = e.clientY;
                            statusElem.css('transition', '');
                        }
                    });

                    element.bind('mouseup', function(e)
                    {

                        if (config.isTouched)
                        {
                            var change = e.clientY - config.prevY;
                            _pullingStopped(change);
                        }
                    });

                    element.bind('mousemove', function(e)
                    {
                        if (config.isTouched)
                        {
                            var change = e.clientY - config.prevY;
                            _pullingDown(change);
                        }
                    });
                }


                //
                // DIRECTIVE DELETION
                //
                scope.$on('$destroy', function()
                {
                    element.unbind('touchstart');
                    element.unbind('touchmove');
                    element.unbind('touchend');
                    element.unbind('mousedown');
                    element.unbind('mouseup');
                    element.unbind('mousemove');
                });


                //
                // INITIALIZATION
                //
                _init();
            }
        };
    }
})();
