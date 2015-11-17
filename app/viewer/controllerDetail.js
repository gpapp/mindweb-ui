angular.module('MindWebUi.viewer.detailController', [
        'ui.bootstrap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree',
        'angular-markdown',
        'angular-keyboard',
        'MindWebUi.public.service',
        'MindWebUi.file.service',
        'MindWebUi.task.service'
    ])
    .controller('viewerDetailController', function ($scope, $http, $timeout) {

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
;
