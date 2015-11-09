angular.module('MindWebUi.viewer', [
        'MindWebUi.public.service',
        'MindWebUi.file.service',
        'ui.router',
        'angular-markdown',
        'ui.bootstrap.tabs',
        'ui.tree',
        'angular-keyboard'
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
                    controller: 'viewerController',
                    data: {
                        requireLogin: false
                    }
                })
                .state('viewer.file', {
                    url: '/{fileId:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}',
                    views: {
                        '': {
                            templateUrl: 'app/viewer/file.html',
                            controller: 'structureController'
                        },
                        'detail@viewer': {
                            templateUrl: 'app/viewer/detail.html',
                            controller: 'detailController'
                        }
                    }
                });
        }
    ])
    .controller('viewerController', function ($scope, $location, $anchorScroll, $interval, FileService,focus) {
        var msgStack = [];
        var saveMutex = false;
        var saveTimer = $interval(function () {
            performSave();
        }, 10000);

        $anchorScroll.yOffset = 50;
        $scope.$on('openId', function (event, data) {
            $scope.openId = data.id;
            event.stopPropagation();
        });
        $scope.$on('selectNode', function (event, data) {
            $scope.currentNode = data.node;
            $scope.currentEditor = {
                text: data.node.nodeMarkdown,
                detail: data.node.detailMarkdown,
                note: data.node.noteMarkdown
            };
            $location.hash(data.node.$['ID']);
            event.stopPropagation();
        });
        $scope.$on('selectTab', function (event, data) {
            if(data.destination!='content') {
                $scope.selectedTab = data.destination;
            } else {
                $scope.selectedTab = 'details';
            }
            focus(data.destination+'ID');
            event.stopPropagation();
        });
        $scope.$on('fileModified', function (event, data) {
            // remove circular references
            if (data.payload && typeof data.payload == 'object') {
                var nodeCopy = (data.payload instanceof Array) ? [] : {};
                angular.copy(data.payload, nodeCopy);
                delete nodeCopy.$parent;
                delete nodeCopy.$parentIndex;
                data.payload = nodeCopy;
            }
            $scope.msgStack = msgStack;
            msgStack.push(data);
            event.stopPropagation();
        });
        $scope.$on("$destroy", function (event) {
                $interval.cancel(saveTimer);
                performSave();
            }
        );

        performSave = function () {
            if (msgStack.length > 0 && !saveMutex) {
                saveMutex = true;
                var messages = [];
                for (var i = 0, len = msgStack.length; i < len; i++) {
                    messages.push(msgStack[i]);
                }
                FileService.save($scope.openId, messages).then(function (data) {
                        msgStack.splice(0, data.length);
                        saveMutex = false;
                    }, function (error) {
                        saveMutex = false;
                    }
                );
            }
        }
    })
    .controller('structureController', function ($scope, $rootScope, $state, $filter, $window, PublicService) {
        // Array of nodes, to be used for lookups.
        var flatNodes = [];

        $rootScope.$emit('$routeChangeStart');

        $rootScope.$on("closeFile", function (event, file) {
            if ($state.params.fileId === file.id) {
                $state.go('files.list');
            }
        });

        PublicService.load($state.params.fileId).then(function (data) {
            $scope.nodes = data.content;
            $scope.nodes.rootNode.open = true;
            $scope.nodes.rootNode.$$hashKey = 'object:0';
            $rootScope.$emit('$routeChangeSuccess');
            $scope.$emit('openId', {id: $state.params.fileId});
            $scope.$emit('selectNode', {node: $scope.nodes.rootNode});
        });

        // create parent/child links, build flat array to store the nodes,
        // to overcome recursion depth limitations
        $scope.setupParent = function (node, $modelValue, $index) {
            if (!node)return;
            flatNodes.push(node);
            node.$parent = $modelValue;
            node.$parentIndex = $index;
        };

        $scope.longPressNode = function (node) {
            $scope.$emit('selectNode', {node: node});
        };
        $scope.nodeToggleOpen = function (node) {
            node.open = !node.open;
            $scope.$emit('fileModified', {event: 'nodeFold', parent: node.$['ID'], payload: node.open});
        };
        $scope.detailToggleOpen = function (node) {
            node.detailOpen = !node.detailOpen;
            $scope.$emit('fileModified', {event: 'nodeDetailFold', parent: node.$['ID'], payload: node.detailOpen});
        };
        $scope.openDetails = function (node, destination) {
            $rootScope.Ui.turnOn('detailPanel');
            $scope.$emit('selectNode', {node: node});
            $scope.$emit('selectTab', {destination: destination});
        };

        $scope.jumptoLink = function (link) {
            if (link[0] == '#') {
                for (var nodeindex in flatNodes) {
                    var node = flatNodes[nodeindex];
                    if (node.$['ID'] === link.substr(1)) {
                        var nodeparent = node.$parent;
                        while (nodeparent.$parent) {
                            nodeparent.open = true;
                            nodeparent = nodeparent.$parent;
                        }
                        $scope.$emit('selectNode', {node: node});
                        break;
                    }
                }
            } else {
                $window.open(link, '_blank');
            }
        };
        $scope.selectNode = function (event) {
            var currentNode = $scope.currentNode;
            switch (event) {
                case 'prev':
                    if (!currentNode.$parent) {
                        break;
                    }
                    if (currentNode.$parentIndex == 0) {
                        // if it's the first node, select it's parent as next
                        $scope.$emit('selectNode', {node: currentNode.$parent});
                    } else {
                        // find the previous node, or it`s last open child
                        if (!currentNode.$parent.node[currentNode.$parentIndex - 1].open) {
                            $scope.$emit('selectNode', {node: currentNode.$parent.node[currentNode.$parentIndex - 1]});
                        } else {
                            //dig down to last open child
                            var ptr = currentNode.$parent.node[currentNode.$parentIndex - 1];
                            outside:
                                do {
                                    for (var i = ptr.node.length - 1; i >= 0; i++) {
                                        if (ptr.node[i].open) {
                                            ptr = ptr.node[i];
                                            break;
                                        } else {
                                            $scope.$emit('selectNode', {node: ptr.node[i]});
                                            break outside;
                                        }
                                    }
                                } while (true);
                        }
                    }
                    break;
                case 'next':
                    if (!currentNode.$parent && !currentNode.open) {
                        break;
                    }
                    if (currentNode.node && currentNode.open) {
                        $scope.$emit('selectNode', {node: currentNode.node[0]});
                    } else if (currentNode.$parentIndex < currentNode.$parent.node.length - 1) {
                        // if it's the last node, select it's parent's sibling as next
                        $scope.$emit('selectNode', {node: currentNode.$parent.node[currentNode.$parentIndex + 1]});
                    } else {
                        var ptr = currentNode.$parent;
                        do {
                            if (!ptr.$parent) {
                                break;
                            }
                            if (ptr.$parentIndex + 1 == ptr.$parent.node.length) {
                                ptr = ptr.$parent;
                                continue;
                            }
                            $scope.$emit('selectNode', {node: ptr.$parent.node[ptr.$parentIndex + 1]});
                            break;
                        } while (true);
                    }
                    break;
                case 'fold':
                    if (currentNode.node) {
                        currentNode.open = false;
                        $scope.$emit('fileModified', {
                            event: 'nodeFold',
                            parent: currentNode.$['ID'],
                            payload: currentNode.open
                        });
                    }
                    break;
                case 'unfold':
                    if (currentNode.node) {
                        currentNode.open = true;
                        $scope.$emit('fileModified', {
                            event: 'nodeFold',
                            parent: currentNode.$['ID'],
                            payload: currentNode.open
                        });
                    }
                    break;
            }
        };
        $scope.addNode = function (target) {
            var newNode = {};
            var timeStamp = new Date().getTime();
            if (typeof target === 'string') {
                newNode.$parent = target === 'current' ? $scope.currentNode : $scope.currentNode.$parent;
                if (!newNode.$parent) {
                    newNode.$parent = $scope.currentNode;
                }
            } else {
                newNode.$parent = target;
            }

            newNode.$ = {CREATED: timeStamp, ID: 'ID_' + timeStamp, MODIFIED: timeStamp, TEXT: 'New Node'};
            newNode.nodeMarkdown = 'New Node';
            var minId = -1;
            for (var i = flatNodes.length - 1; i >= 0; i--) {
                var curNum = Number(flatNodes[i].$$hashKey.substr(7));
                if (curNum > minId) {
                    minId = curNum;
                }
            }
            newNode.$$hashKey = 'object:' + (minId + 1);
            if (newNode.$parent.node) {
                newNode.$parent.node.push(newNode);
            } else {
                newNode.$parent.node = [newNode];
            }
            newNode.$parentIndex = newNode.$parent.node.length - 1;

            flatNodes.push(newNode);
            // Make sure the node is open, so the new node is shown
            newNode.$parent.open = true;
            $scope.$emit('selectNode', {node: newNode});
            $scope.$emit('fileModified', {event: 'newNode', parent: newNode.$parent.$['ID'], payload: newNode});
        };
        $scope.deleteNode = function (target) {
            if (typeof target === 'string') {
                target = $scope.currentNode;
                if (!target.$parent) {
                    return;
                }
            }
            var ptr = target;
            // TODO: Do a deep tree traversal to remove the nodes under it
            while (true) {
                if (ptr === target && !ptr.node) break;
                if (ptr.node && ptr.node.length > 0) {
                    ptr = ptr.node[0];
                } else {
                    flatNodes.splice(flatNodes.indexOf(ptr), 1);
                    ptr = ptr.$parent;
                    ptr.node.splice(0, 1);
                    if (ptr.node.length == 0) {
                        delete ptr.node;
                        delete ptr.open;
                    }
                }
            }
            flatNodes.splice(flatNodes.indexOf(target), 1);
            var parent = target.$parent;
            parent.node.splice(target.$parentIndex, 1);
            for (var i=target.$parentIndex;i<parent.node.length;i++) {
                parent.node[i].$parentIndex = i;
            }
            if (parent.node.length == 0) {
                delete parent.node;
                delete parent.open;
            }
            $scope.$emit('fileModified', {event: 'deleteNode', parent: target.$parent.$['ID'], payload: target.$['ID']});
            $scope.selectNode('prev');
        }
    })
    .controller('detailController', function ($scope, $http, $timeout) {

        $http.get('app/viewer/iconlist.json')
            .then(function (res) {
                $scope.iconList = res.data;
            });

        var nodeTimeoutPromise;
        var detailTimeoutPromise;
        var noteTimeoutPromise;
        var editortimeoutDelay = 1000;

        $scope.$watch('currentEditor.text', function (newValue, oldValue) {
            if ($scope.currentNode.nodeMarkdown != newValue) {
                $scope.currentNode.nodeMarkdown = newValue;
                $timeout.cancel(nodeTimeoutPromise);
                nodeTimeoutPromise = $timeout(function () {
                    $scope.$emit('fileModified', {
                        event: 'nodeText',
                        parent: $scope.currentNode.$['ID'],
                        payload: newValue
                    });
                }, editortimeoutDelay);
            }
        });

        $scope.$watch('currentEditor.detail', function (newValue, oldValue) {
            if ($scope.currentNode.detailMarkdown != newValue) {
                $scope.currentNode.detailMarkdown = newValue;
                $timeout.cancel(detailTimeoutPromise);
                detailTimeoutPromise = $timeout(function () {
                    $scope.$emit('fileModified', {
                        event: 'nodeDetail',
                        parent: $scope.currentNode.$['ID'],
                        payload: newValue
                    });
                }, editortimeoutDelay);
            }
        });

        $scope.$watch('currentEditor.note', function (newValue, oldValue) {
            if ($scope.currentNode.noteMarkdown != newValue) {
                $scope.currentNode.noteMarkdown = newValue;
                $timeout.cancel(noteTimeoutPromise);
                noteTimeoutPromise = $timeout(function () {

                    $scope.$emit('fileModified', {
                        event: 'nodeNote',
                        parent: $scope.currentNode.$['ID'],
                        payload: newValue
                    });
                }, editortimeoutDelay);
            }
        });

        $scope.moveIcon = function (pos, dir) {
            var node = $scope.currentNode;
            var icons = node.icon;
            var cut = icons[pos];
            var target;
            switch (dir) {
                case 'left':
                    target = pos - 1;
                    break;
                case 'right':
                    target = pos + 1;
                    break;
            }
            icons[pos] = icons[target];
            icons[target] = cut;
            $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: icons});
        };

        $scope.deleteIcon = function (pos) {
            var node = $scope.currentNode;
            node.icon.splice(pos, 1);
            if (node.icon.length == 0) {
                delete node.icon;
            }
            $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
        };

        $scope.addIcon = function (name) {
            var node = $scope.currentNode;
            if (node.icon) {
                node.icon.push({'$': {BUILTIN: name}});
            } else {
                node.icon = [{'$': {BUILTIN: name}}];
            }
            $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
        };

        $scope.selectTab = function (destination) {
            $scope.$emit('selectTab', {destination: destination});
        };
    })
     .factory('focus', function($timeout, $window) {
    return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  })
  .directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
        elem.off(attr.eventFocus);
      });
    };
  })
    .directive('onShortPress', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                function endTouch(evt) {
                    if (!$scope.skipPress && $attrs.onShortPress) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onShortPress);
                        });
                        evt.stopPropagation();
                    }
                     $scope.skipPress=false;
                    // Prevent the onLongPress event from firing
                    $scope.longPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd);
                        });
                    }
                }

                $elm.bind('touchend', endTouch);
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
                    $scope.longPress = true;
                    // We'll set a timeout for 600 ms for a long press
                    $timeout(function () {
                        if ($scope.longPress) {
                            // If the touchend event hasn't fired,
                            // apply the function given in on the element's on-long-press attribute
                            $scope.$apply(function () {
                                // mark the event fired, so the short press won't execute    
                                $scope.skipPress = true;
                                $scope.$eval($attrs.onLongPress);
                            });
                        }
                    }, 600);
                }

                function endTouch(evt) {
                    // Prevent the onLongPress event from firing
                    $scope.longPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd);
                        });
                    }
                    evt.stopPropagation();
                }

                $elm.bind('touchstart', startTouch);
                $elm.bind('touchend', endTouch);
                $elm.bind('mousedown', startTouch);
                $elm.bind('mouseup', endTouch);
            }
        };
    })
;
