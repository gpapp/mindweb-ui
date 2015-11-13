angular.module('MindWebUi.viewer', [
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree',
        'angular-markdown',
        'angular-keyboard',
        'MindWebUi.public.service',
        'MindWebUi.file.service',
        'MindWebUi.task.service',
        'MindWebUi.viewer.mainController',
        'MindWebUi.viewer.treeController',
        'MindWebUi.viewer.detailController'
    ])
    .filter('escape', function () {
        return window.encodeURIComponent;
    })
    .config(['$stateProvider',
        function ($stateProvider, $rootScope) {
            $stateProvider
                .state('viewer', {
                    abstract: true,
                    url: '/viewer',
                    templateUrl: '/app/viewer/viewerTemplate.html',
                    controller: 'viewerMainController',
                    controllerAs: 'viewerMainController',
                    data: {
                        requireLogin: false
                    }
                })
                .state('viewer.file', {
                    url: '/{fileId:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}',
                    views: {
                        '': {
                            templateUrl: 'app/viewer/file.html',
                            controller: 'viewerTreeController',
                            controllerAs: 'viewerTreeController'
                        },
                        'detail@viewer': {
                            templateUrl: 'app/viewer/detail.html',
                            controller: 'viewerDetailController',
                            controllerAs: 'viewerDetailController'
                        }
                    }
                });
        }
    ])
    .factory('focus', function ($timeout, $window) {
        return function (id) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    })
    .directive('eventFocus', function (focus) {
        return function (scope, elem, attr) {
            elem.on(attr.eventFocus, function () {
                focus(attr.eventFocusId);
            });

            // Removes bound events in the element itself
            // when the scope is destroyed
            scope.$on('$destroy', function () {
                elem.off(attr.eventFocus);
            });
        };
    })
    .directive('onShortPress', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                function startTouch(evt) {
                    // Locally scoped variable that will keep track of the long press
                    $scope.$inPress = true;
                }

                function endTouch(evt) {
                    if (!$scope.$skipShortPress && $attrs.onShortPress) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onShortPress);
                        });
                        evt.stopPropagation();
                    }
                    $scope.$skipShortPress = false;
                    // Prevent the onLongPress event from firing
                    $scope.$inPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd);
                        });
                    }
                }

                function skipTouch(evt) {
                    if ($inPress) {
                        $scope.$skipShortPress = true;
                        $inPress=false;
                    }
                }

                $elm.bind('touchmove', skipTouch);
                $elm.bind('mousemove', skipTouch);
                $elm.bind('touchstart', startTouch);
                $elm.bind('touchend', endTouch);
                $elm.bind('mousedown', startTouch);
                $elm.bind('mouseup', endTouch);
            }
        };
    })
    .directive('onLongPress', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                function startTouch(evt) {
                    // Locally scoped variable that will keep track of the long press
                    $scope.$inPress = true;
                    // We'll set a timeout for 600 ms for a long press
                    $timeout(function () {
                        if ($scope.$inPress) {
                            // If the touchend event hasn't fired,
                            // apply the function given in on the element's on-long-press attribute
                            $scope.$apply(function () {
                                // mark the event fired, so the short press won't execute    
                                $scope.$skipShortPress = true;
                                $scope.$eval($attrs.onLongPress);
                            });
                        }
                    }, 600);
                }

                function endTouch(evt) {
                    // Prevent the onLongPress event from firing
                    $scope.$inPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd);
                        });
                    }
                    evt.stopPropagation();
                }

                function skipTouch(evt) {
                    if ($scope.$inPress) {
                        $scope.$skipShortPress = true;
                        $inPress=false;
                    }
                }

                $elm.bind('touchmove', skipTouch);
                $elm.bind('mousemove', skipTouch);
                $elm.bind('touchstart', startTouch);
                $elm.bind('touchend', endTouch);
                $elm.bind('mousedown', startTouch);
                $elm.bind('mouseup', endTouch);
            }
        };
    })
;
