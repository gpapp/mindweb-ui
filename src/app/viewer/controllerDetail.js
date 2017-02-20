angular.module('MindWebUi.viewer.detailController', [
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree',
        'angular-markdown',
        'cfp.hotkeys',
        'MindWebUi.public.service',
        'MindWebUi.file.service',
        'MindWebUi.task.service'
    ])
    .controller('viewerDetailController',
        function ($scope,
                  $timeout,
                  SharedState,
                  hotkeys) {

            bindKeys();
            $scope.$on('mobile-angular-ui.state.changed.iconDialog', function (e, newVal, oldVal) {
                if (newVal === false) {
                    bindKeys();
                }
            });

            var nodeTimeoutPromise;
            var detailTimeoutPromise;
            var noteTimeoutPromise;
            var editortimeoutDelay = 1000;

            $scope.$watch('currentEditor.text', function (newValue, oldValue) {
            });

            $scope.$watch('currentEditor.text', function (newValue, oldValue) {
                if ($scope.currentNode.nodeMarkdown != newValue) {
                    $scope.currentNode.nodeMarkdown = newValue;
                    $timeout.cancel(nodeTimeoutPromise);
                    nodeTimeoutPromise = $timeout(function () {
                        $scope.$emit('fileModified', {
                            event: 'nodeText',
                            parent: $scope.currentNode.$['ID'],
                            payload: newValue,
                            oldValue: oldValue
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
                            payload: newValue,
                            oldValue: oldValue
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
                            payload: newValue,
                            oldValue: oldValue
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

            $scope.deleteLastIcon = function () {
                var node = $scope.currentNode;
                node.icon.pop();
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
                $scope.iconDialog = false;
                $scope.$emit('fileModified', {event: 'nodeModifyIcons', parent: node.$['ID'], payload: node.icon});
            };

            $scope.selectTab = function (destination) {
                $scope.$emit('selectTab', {destination: destination});
            };

            function bindKeys() {
                hotkeys.bindTo($scope)
                    .add({
                        combo: 'esc',
                        description: 'Close details',
                        allowIn: ['TEXTAREA'],
                        persistent: false,
                        callback: function () {
                            hotkeys.purgeHotkeys();
                            SharedState.turnOff('detailPanel');
                        }
                    });

            }
        })
    .controller('viewerIconDialogController',
        function ($scope,
                  $http,
                  SharedState,
                  hotkeys) {
            $http.get('app/viewer/iconlist.json')
                .then(function (res) {
                    $scope.iconList = res.data;
                    for (var i = 0; i < $scope.iconList.length; i++) {
                        var cur = $scope.iconList[i];
                        if (cur.shortcut) {
                            hotkeys.bindTo($scope).add({
                                    origIndex:i,
                                combo: cur.shortcut,
                                description: cur.description ? cur.description : cur.name,
                                persistent: true,
                                callback: getHotkeyCallback(cur.name)
                            });
                            function getHotkeyCallback(name){
                                 return function (event,hotkey) {
                                    $scope.addIcon(name);
                                    closeDialog();
                                }
                            }
                        }
                    }
                });
            $scope.selectedIndex = 0;
            hotkeys.purgeHotkeys();
            document.activeElement.blur();

            hotkeys.bindTo($scope)
                .add({
                    combo: 'alt+h',
                    description: 'Show help',
                    persistent: false,
                    callback: function (event,hotkey) {
                        hotkeys.toggleCheatSheet();
                    }
                })
                .add({
                    combo: 'del',
                    description: 'Delete last icon',
                    persistent: false,
                    callback: function () {
                        $scope.deleteLastIcon();
                        closeDialog();
                    }
                })
                .add({
                    combo: 'esc',
                    description: 'Close icon dialog',
                    persistent: false,
                    callback: function () {
                        closeDialog();
                    }
                })
                .add({
                    combo: 'left',
                    description: 'Select last',
                    persistent: false,
                    callback: function () {
                        if ($scope.selectedIndex) $scope.selectedIndex--;
                    }
                })
                .add({
                    combo: 'right',
                    description: 'Select next',
                    persistent: false,
                    callback: function () {
                        if ($scope.selectedIndex < $scope.iconList.length - 1) $scope.selectedIndex++;
                    }
                })
                .add({
                    combo: ['enter','space'],
                    description: 'Select current',
                    persistent: false,
                    callback: function () {
                        $scope.addIcon($scope.iconList[$scope.selectedIndex].name);
                        closeDialog();
                    }
                });
            function closeDialog() {
                hotkeys.purgeHotkeys();
                SharedState.turnOff('iconDialog');
            }
        })
;
