angular.module('MindWebUi.viewer.mainController', [
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
    .controller('viewerMainController', function ($scope, $location, $anchorScroll, $interval, FileService, focus) {
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
            if (data.destination != 'content') {
                $scope.selectedTab = data.destination;
            } else {
                $scope.selectedTab = 'details';
            }
            focus(data.destination + 'ID');
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
;
