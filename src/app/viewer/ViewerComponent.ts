import {Component, OnInit} from "@angular/core";
import ViewerService from "../service/ViewerService";
import {ActivatedRoute, Params} from "@angular/router";
import MapNode from "mindweb-request-classes/classes/MapNode";
/**
 * Created by gpapp on 2017.03.26..
 */
@Component({
    selector: "viewer-root",
    templateUrl: "/templates/viewer/Viewer.html"
})
export default class ViewerComponent implements OnInit {
    private _currentNode: MapNode;
    private _showDetail: boolean = true;

    get currentNode(): MapNode {
        return this._currentNode;
    }

    set currentNode(value: MapNode) {
        this._currentNode = value;
    }

    get showDetail(): boolean {
        return this._showDetail;
    }

    set showDetail(value: boolean) {
        this._showDetail = value;
    }

    constructor(private route: ActivatedRoute,
                private viewerService: ViewerService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            if (params['mapId']) {
                this.viewerService.loadMap(params['mapId']);
            }
        });
    }

}
/**
 angular.module('MindWebUi.viewer', [
 'ui.router',
 'MindWebUi.viewer.mainController',
 'MindWebUi.viewer.treeController',
 'MindWebUi.viewer.taskController',
 'MindWebUi.viewer.mindmapController',
 'MindWebUi.viewer.detailController'
 ])
 .filter('escape', function () {
        return window.encodeURIComponent;
    })
 .config(['$stateProvider',
 function ($stateProvider) {
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
                .state('viewer.display', {
                    url: '/display',
                    views: {
                        'tree@viewer': {
                            templateUrl: 'app/viewer/ViewerTree.html',
                            controller: 'viewerTreeController',
                            controllerAs: 'viewerTreeController'
                        },
                        'task@viewer': {
                            templateUrl: 'app/viewer/ViewerTask.html',
                            controller: 'viewerTaskController',
                            controllerAs: 'viewerTaskController'
                        },
                        'mindmap@viewer': {
                            templateUrl: 'app/viewer/ViewerMindmap.html',
                            controller: 'viewerMindmapController',
                            controllerAs: 'viewerMindmapController'
                        },
                        'detail@viewer': {
                            templateUrl: 'app/viewer/ViewerDetail.html',
                            controller: 'viewerDetailController',
                            controllerAs: 'viewerDetailController'
                        }
                    },
                    params: {fileContent: null},
                    data: {
                        displayOnly: true
                    }
                })
                .state('viewer.file', {
                    url: '/{fileId:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}',
                    views: {
                        'tree@viewer': {
                            templateUrl: 'app/viewer/ViewerTree.html',
                            controller: 'viewerTreeController',
                            controllerAs: 'viewerTreeController'
                        },
                        'task@viewer': {
                            templateUrl: 'app/viewer/ViewerTask.html',
                            controller: 'viewerTaskController',
                            controllerAs: 'viewerTaskController'
                        },
                        'mindmap@viewer': {
                            templateUrl: 'app/viewer/ViewerMindmap.html',
                            controller: 'viewerMindmapController',
                            controllerAs: 'viewerMindmapController'
                        },
                        'detail@viewer': {
                            templateUrl: 'app/viewer/ViewerDetail.html',
                            controller: 'viewerDetailController',
                            controllerAs: 'viewerDetailController'
                        }
                    }
                });
        }
 ])
 .factory('focusElement', function ($timeout, $window) {
        return function (id, selectAll) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element) {
                    element.focus();
                    if (selectAll) {
                        element.select();
                    }
                }
            }, 500);
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
 .directive('onShortPress', function ($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                function startTouch(evt) {
                    // Locally scoped variable that will keep track of the long press
                    $rootScope.$inPress = true;
                }

                function endTouch(evt) {
                    if (!$rootScope.$inPress) {
                        return;
                    }
                    $rootScope.$skipShortPress = false;
                    // Prevent the onLongPress event from firing
                    $rootScope.$inPress = false;
                    if (!$rootScope.$skipShortPress && $attrs.onShortPress) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onShortPress);
                        });
                        evt.stopPropagation();
                    }
                }

                function skipTouch(evt) {
                    if ($rootScope.$inPress) {
                        $rootScope.$skipShortPress = true;
                        $rootScope.$inPress = false;
                    }
                }

                //$elm.bind('touchstart', startTouch);
                //$elm.bind('touchend', endTouch);
                $elm.bind('touchmove', skipTouch);

                $elm.bind('mousedown', startTouch);
                $elm.bind('mouseup', endTouch);
                $elm.bind('mousemove', skipTouch);
            }
        };
    })
 .directive('onLongPress', function ($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                function startTouch(evt) {
                    // Locally scoped variable that will keep track of the long press
                    $rootScope.$inPress = true;
                    // We'll set a timeout for 600 ms for a long press
                    $timeout(function () {
                        if ($rootScope.$inPress) {
                            // If the touchend event hasn't fired,
                            // apply the function given in on the element's on-long-press attribute
                            $scope.$apply(function () {
                                // mark the event fired, so the short press won't execute
                                $rootScope.$inPress = false;
                                $rootScope.$skipShortPress = true;
                                $scope.$eval($attrs.onLongPress);
                            });
                        }
                    }, 600);
                }

                function endTouch(evt) {
                    if (!$rootScope.$inPress) {
                        return;
                    }
                    // Prevent the onLongPress event from firing
                    $rootScope.$inPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd);
                        });
                    }
                    evt.stopPropagation();
                }

                function skipTouch(evt) {
                    if ($rootScope.$inPress) {
                        $rootScope.$skipShortPress = true;
                        $rootScope.$inPress = false;
                    }
                }

                //$elm.bind('touchstart', startTouch);
                //$elm.bind('touchend', endTouch);
                $elm.bind('touchmove', skipTouch);

                $elm.bind('mousedown', startTouch);
                $elm.bind('mouseup', endTouch);
                $elm.bind('mousemove', skipTouch);
            }
        };
    })
 ;*/