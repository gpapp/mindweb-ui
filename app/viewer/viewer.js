angular.module('MindWebUi.viewer', [
    'MindWebUi.file.service',
    'ui.router',
    'angular-markdown',
    'ui.bootstrap.tabs'
])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('viewer', {
                    abstract: true,
                    url: '/viewer',
                    templateUrl: '/app/viewer/viewerTemplate.html',
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
    .controller('structureController', function ($scope, $rootScope, $state, $filter, FileApi) {

        $rootScope.loading = true;

        FileApi.load($state.params.fileId).then(function (data) {
            $scope.nodes = data.fileVersion.content;
            $scope.nodes.open = true;
            $rootScope.loading = false;
        });

        $scope.nodeIcon = function (node) {
            if (node.nodes) {
                for(var i= 0, tot=node.nodes.length; i<tot; i++) {
                    if (node.nodes[i].name === 'node') {
                        return node['open'] ? 'fa-chevron-down' : 'fa-chevron-right';
                    }
                }
            }
            return 'hidden';
        };
        $scope.nodeToggleOpen = function (node) {
            node.open = !node.open;
        };
        $scope.refreshDetail = function (node) {
            $rootScope.$broadcast('refreshDetail', {node: node});
        };

        $scope.detailMarkdown = function(node) {
            if (!node.nodes){
                return false;
            }
            if (node.detailMarkdown){
                return node.detailMarkdown;
            }
            var ret = $filter('filter')(node.nodes,{name:'richContent',attributes:{TYPE:'DETAIL'}});
            if(ret.length==1) {
                node.detailMarkdown = buildMarkdownContent(ret[0].nodes);
                return true;
            } else {
                node.detailMarkdown = '';
                return false;
            }
        }
    }
)
    .controller('detailController', function ($scope, $state) {
        $scope.$on('refreshDetail', function (event, data) {
            $scope.node = data.node;
        });

    });

var urlPattern = /(^|[\s\n]|<br\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
function buildMarkdownContent(nodes){
    var retval = '';
    nodes.forEach(function(n) {
        if(n.name === 'p') {
            if (n.value) {
                retval += n.value.trim().replace(urlPattern, '$1[$2]($2)');
            }
            retval += '\n\n';
        }
        if (n.nodes) {
            retval += buildMarkdownContent(n.nodes);
        }
    });
    return retval;
}