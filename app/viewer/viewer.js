angular.module('MindWebUi.viewer', [
    'ui.router'
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
                    url: '/{fileId:[0-9]{1,8}}',
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
    .controller('structureController', function ($scope, $rootScope, $state) {
        $scope.nodes =
        {
            name: "map",
            attributes: {"version": "freeplane 1.3.0"},
            children: [{
                name: "node",
                attributes: {
                    "MODIFIED": "1427226124888",
                    "TEXT": "My tasks",
                    "LOCALIZED_STYLE_REF": "AutomaticLayout.level.root",
                    "ID": "ID_1723255651",
                    "CREATED": "1283093380553"
                },
                children: [{
                    name: "hook",
                    attributes: {name: "MapStyle"},
                    children: [{
                        name: "properties",
                        attributes: {"show_icon_for_attributes": "true"}
                    }, {
                        name: "map_styles",
                        children: [{
                            name: "stylenode",
                            attributes: {"LOCALIZED_TEXT": "styles.root_node"},
                            children: [{
                                name: "stylenode",
                                attributes: {"LOCALIZED_TEXT": "styles.predefined", "POSITION": "right"},
                                children: [{
                                    name: "stylenode",
                                    attributes: {
                                        "STYLE": "as_parent",
                                        "LOCALIZED_TEXT": "default",
                                        "MAX_WIDTH": "600",
                                        "COLOR": "#000000"
                                    },
                                    children: [{
                                        name: "font",
                                        attributes: {
                                            name: "Calibri",
                                            "ITALIC": "false",
                                            "BOLD": "false",
                                            "SIZE": "10"
                                        }
                                    }, {name: "edge", attributes: {"STYLE": "bezier", "WIDTH": "thin"}}]
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "defaultstyle.details"}
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "defaultstyle.note"}
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "defaultstyle.floating"},
                                    children: [{
                                        name: "edge",
                                        attributes: {"STYLE": "hide_edge"}
                                    }, {name: "cloud", attributes: {"SHAPE": "ROUND_RECT", "COLOR": "#f0f0f0"}}]
                                }]
                            }, {
                                name: "stylenode",
                                attributes: {"LOCALIZED_TEXT": "styles.user-defined", "POSITION": "right"},
                                children: [{
                                    name: "stylenode",
                                    attributes: {
                                        "STYLE": "fork",
                                        "LOCALIZED_TEXT": "styles.topic",
                                        "COLOR": "#18898b"
                                    },
                                    children: [{
                                        name: "font",
                                        attributes: {name: "Liberation Sans", "BOLD": "true", "SIZE": "10"}
                                    }]
                                }, {
                                    name: "stylenode",
                                    attributes: {
                                        "STYLE": "fork",
                                        "LOCALIZED_TEXT": "styles.subtopic",
                                        "COLOR": "#cc3300"
                                    },
                                    children: [{
                                        name: "font",
                                        attributes: {name: "Liberation Sans", "BOLD": "true", "SIZE": "10"}
                                    }]
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "styles.subsubtopic", "COLOR": "#669900"},
                                    children: [{
                                        name: "font",
                                        attributes: {name: "Liberation Sans", "BOLD": "true", "SIZE": "10"}
                                    }]
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "styles.important"},
                                    children: [{name: "icon", attributes: {"BUILTIN": "yes"}}]
                                }]
                            }, {
                                name: "stylenode",
                                attributes: {"LOCALIZED_TEXT": "styles.AutomaticLayout", "POSITION": "right"},
                                children: [{
                                    name: "stylenode",
                                    attributes: {
                                        "LOCALIZED_TEXT": "AutomaticLayout.level.root",
                                        "COLOR": "#000000",
                                        "BACKGROUND_COLOR": "#fefc74"
                                    },
                                    children: [{name: "font", attributes: {"SIZE": "18"}}]
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "AutomaticLayout.level,1", "COLOR": "#0033ff"},
                                    children: [{name: "font", attributes: {"SIZE": "16"}}]
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "AutomaticLayout.level,2", "COLOR": "#00b439"},
                                    children: [{name: "font", attributes: {"SIZE": "14"}}]
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "AutomaticLayout.level,3", "COLOR": "#990000"},
                                    children: [{name: "font", attributes: {"SIZE": "12"}}]
                                }, {
                                    name: "stylenode",
                                    attributes: {"LOCALIZED_TEXT": "AutomaticLayout.level,4", "COLOR": "#111111"},
                                    children: [{name: "font", attributes: {"SIZE": "10"}}]
                                }]
                            }]
                        }]
                    }]
                }, {name: "hook", attributes: {name: "AutomaticEdgeColor", "COUNTER": "7"}}, {
                    name: "node",
                    attributes: {
                        "MODIFIED": "1427226969704",
                        "TEXT": "Someday-Maybe",
                        "LOCALIZED_STYLE_REF": "AutomaticLayout.level,1",
                        "ID": "ID_1137711775",
                        "CREATED": "1427225928280",
                        "POSITION": "left"
                    },
                    children: [{name: "edge", attributes: {"COLOR": "#ff00ff"}}, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427231218466",
                            "TEXT": "FreeplaneWeb",
                            "LOCALIZED_STYLE_REF": "AutomaticLayout.level,2",
                            "ID": "ID_265885849",
                            "CREATED": "1427231207820"
                        },
                        children: [{
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427231281279",
                                "TEXT": "*Create web based mindmap editor for Freeplane with the same functionality {Someday} @Computer @Hobby",
                                "ID": "ID_825572237",
                                "CREATED": "1427231222501"
                            }
                        }]
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427298578517",
                            "TEXT": "Freeplane GTD",
                            "LOCALIZED_STYLE_REF": "AutomaticLayout.level,2",
                            "ID": "ID_1342627143",
                            "CREATED": "1427298564675"
                        },
                        children: [{
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427298553304",
                                "TEXT": "* Create cloud synchronization feature for Freeplane {Someday} @Computer @Hobby",
                                "ID": "ID_805969038",
                                "CREATED": "1427298513352"
                            }
                        }, {
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427298684965",
                                "TEXT": "* Create Freeplane Android client",
                                "ID": "ID_1460792926",
                                "CREATED": "1427298638982"
                            },
                            children: [{
                                name: "node",
                                attributes: {
                                    "MODIFIED": "1427298690372",
                                    "TEXT": "With attribute support",
                                    "ID": "ID_1707305919",
                                    "CREATED": "1427298686159"
                                }
                            }, {
                                name: "node",
                                attributes: {
                                    "MODIFIED": "1427298704789",
                                    "TEXT": "Compatible GTD view",
                                    "ID": "ID_672776537",
                                    "CREATED": "1427298690911"
                                }
                            }]
                        }]
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427298577125",
                            "TEXT": "Skills",
                            "LOCALIZED_STYLE_REF": "AutomaticLayout.level,2",
                            "ID": "ID_391031802",
                            "CREATED": "1427298571259"
                        },
                        children: [{
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427298596825",
                                "TEXT": "* Improve presentation skills {Someday}",
                                "ID": "ID_972517531",
                                "CREATED": "1427298579619"
                            }
                        }, {
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427298628338",
                                "TEXT": "* Learn to write Android applications {Someday}",
                                "ID": "ID_391734240",
                                "CREATED": "1427298598804"
                            }
                        }]
                    }]
                }, {
                    name: "node",
                    attributes: {
                        "MODIFIED": "1427226969057",
                        "TEXT": "Archive",
                        "LOCALIZED_STYLE_REF": "AutomaticLayout.level,1",
                        "ID": "ID_1068479685",
                        "CREATED": "1427225933330",
                        "POSITION": "left"
                    },
                    children: [{name: "edge", attributes: {"COLOR": "#00ffff"}}]
                }, {
                    name: "node",
                    attributes: {
                        "MODIFIED": "1427227152051",
                        "TEXT": "Config",
                        "LOCALIZED_STYLE_REF": "styles.topic",
                        "ID": "ID_867421423",
                        "CREATED": "1427226495651",
                        "POSITION": "left"
                    },
                    children: [{name: "edge", attributes: {"COLOR": "#7c0000"}}, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427226607171",
                            "TEXT": "Icon: @Computer",
                            "ID": "ID_1821210832",
                            "CREATED": "1427226511560"
                        },
                        children: [{name: "icon", attributes: {"BUILTIN": "male1"}}]
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427226613079",
                            "TEXT": "Icon: @email",
                            "ID": "ID_368331860",
                            "CREATED": "1427226532275"
                        },
                        children: [{name: "icon", attributes: {"BUILTIN": "Mail"}}]
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427226653217",
                            "TEXT": "Icon: @Meeting",
                            "ID": "ID_1136940334",
                            "CREATED": "1427226567638"
                        },
                        children: [{name: "icon", attributes: {"BUILTIN": "group"}}]
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427226659054",
                            "TEXT": "Icon: @Home",
                            "ID": "ID_635308207",
                            "CREATED": "1427226636588"
                        },
                        children: [{name: "icon", attributes: {"BUILTIN": "gohome"}}]
                    }]
                }, {
                    name: "node",
                    attributes: {
                        "MODIFIED": "1427226966224",
                        "TEXT": "Inbox",
                        "LOCALIZED_STYLE_REF": "AutomaticLayout.level,1",
                        "ID": "ID_1133937836",
                        "CREATED": "1427225825443",
                        "POSITION": "right"
                    },
                    children: [{name: "edge", attributes: {"COLOR": "#ff0000"}}, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427231521272",
                            "TEXT": "* Must create GTD presentation {03.24} [Papp Gergely] @Home,Computer",
                            "ID": "ID_1916348085",
                            "CREATED": "1427227326210"
                        },
                        children: [{
                            name: "richcontent",
                            attributes: {"TYPE": "DETAILS"},
                            children: [{
                                name: "html",
                                children: [{name: "head"}, {
                                    name: "body",
                                    children: [{name: "p", "value": "\n Outline\n "}, {
                                        name: "p",
                                        "value": "\n \u00A0- why use mindmap\n "
                                    }, {name: "p", "value": "\n \u00A0- how to use freeplane\n "}, {
                                        name: "p",
                                        "value": "\n \u00A0- Live demo\n "
                                    }],
                                    "value": "\n Outline\n \n \u00A0- why use mindmap\n \n \u00A0- how to use freeplane\n \n \u00A0- Live demo\n "
                                }],
                                "value": "\n Outline\n \n \u00A0- why use mindmap\n \n \u00A0- how to use freeplane\n \n \u00A0- Live demo\n "
                            }],
                            "value": "\n Outline\n \n \u00A0- why use mindmap\n \n \u00A0- how to use freeplane\n \n \u00A0- Live demo\n "
                        }],
                        "value": "\n Outline\n \n \u00A0- why use mindmap\n \n \u00A0- how to use freeplane\n \n \u00A0- Live demo\n "
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427227649916",
                            "TEXT": "* Buy dog food @Home @Shop",
                            "ID": "ID_1190980308",
                            "CREATED": "1427227601160"
                        }
                    }],
                    "value": "\n Outline\n \n \u00A0- why use mindmap\n \n \u00A0- how to use freeplane\n \n \u00A0- Live demo\n "
                }, {
                    name: "node",
                    attributes: {
                        "MODIFIED": "1427226965326",
                        "TEXT": "Projects",
                        "LOCALIZED_STYLE_REF": "AutomaticLayout.level,1",
                        "ID": "ID_1256051703",
                        "CREATED": "1427225914994",
                        "POSITION": "right"
                    },
                    children: [{name: "edge", attributes: {"COLOR": "#ffff00"}}, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427227314713",
                            "TEXT": "Work",
                            "LOCALIZED_STYLE_REF": "AutomaticLayout.level,2",
                            "ID": "ID_643907318",
                            "CREATED": "1427227287355"
                        },
                        children: [{name: "icon", attributes: {"BUILTIN": "list"}}, {
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427231709648",
                                "TEXT": "General",
                                "LOCALIZED_STYLE_REF": "AutomaticLayout.level,3",
                                "ID": "ID_385574729",
                                "CREATED": "1427231494328"
                            },
                            children: [{name: "icon", attributes: {"BUILTIN": "list"}}, {
                                name: "node",
                                attributes: {
                                    "MODIFIED": "1427231573301",
                                    "TEXT": "* Talk to boss about a raise [Pointy Haired Boss] {4.1}",
                                    "ID": "ID_759486144",
                                    "CREATED": "1427231527097"
                                }
                            }]
                        }, {
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427231668045",
                                "TEXT": "Process optimization project",
                                "LOCALIZED_STYLE_REF": "AutomaticLayout.level,3",
                                "ID": "ID_914627740",
                                "CREATED": "1427231501308"
                            },
                            children: [{name: "icon", attributes: {"BUILTIN": "list"}}, {
                                name: "node",
                                attributes: {
                                    "MODIFIED": "1427231734975",
                                    "TEXT": "* Spend hours with HPC {4.1} [Dogbert] @Meeting",
                                    "ID": "ID_1900184887",
                                    "CREATED": "1427231669835"
                                }
                            }, {
                                name: "node",
                                attributes: {
                                    "MODIFIED": "1427231786427",
                                    "TEXT": "* Reply to consultant's QA assessment @email [Dogbert]",
                                    "ID": "ID_1236162794",
                                    "CREATED": "1427231735450"
                                }
                            }]
                        }]
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427227309084",
                            "TEXT": "Meetups",
                            "LOCALIZED_STYLE_REF": "AutomaticLayout.level,2",
                            "ID": "ID_99225657",
                            "CREATED": "1427227292551"
                        },
                        children: [{name: "icon", attributes: {"BUILTIN": "list"}}]
                    }, {
                        name: "node",
                        attributes: {
                            "MODIFIED": "1427231195818",
                            "TEXT": "Hobby",
                            "LOCALIZED_STYLE_REF": "AutomaticLayout.level,2",
                            "ID": "ID_1535763691",
                            "CREATED": "1427231176268"
                        },
                        children: [{name: "icon", attributes: {"BUILTIN": "list"}}, {
                            name: "node",
                            attributes: {
                                "MODIFIED": "1427231288794",
                                "TEXT": "FreeplaneGTD",
                                "LOCALIZED_STYLE_REF": "AutomaticLayout.level,3",
                                "ID": "ID_471511405",
                                "CREATED": "1427231197233"
                            },
                            children: [{
                                name: "node",
                                attributes: {
                                    "MODIFIED": "1427231487180",
                                    "TEXT": "* Archive competed tasks with structures {Later} [Papp Gergely] @Computer @Hobby",
                                    "ID": "ID_1561371231",
                                    "CREATED": "1427231289474"
                                }
                            }]
                        }]
                    }]
                }, {
                    name: "node",
                    attributes: {
                        "MODIFIED": "1427226967361",
                        "TEXT": "Review",
                        "LOCALIZED_STYLE_REF": "AutomaticLayout.level,1",
                        "ID": "ID_117855996",
                        "CREATED": "1427225917881",
                        "POSITION": "right"
                    },
                    children: [{name: "edge", attributes: {"COLOR": "#00ff00"}}]
                }],
                "value": "\n Outline\n \n \u00A0- why use mindmap\n \n \u00A0- how to use freeplane\n \n \u00A0- Live demo\n "
            }],
            "value": "\n Outline\n \n \u00A0- why use mindmap\n \n \u00A0- how to use freeplane\n \n \u00A0- Live demo\n "
        };
        $scope.nodeIcon = function (node) {
            return node['open'] ? 'fa-toggle-down' : 'fa-toggle-right';
        };
        $scope.nodeToggleOpen = function (node) {
            node.open = !node.open;
        };
        $scope.refreshDetail = function (node) {
            $rootScope.$broadcast('refreshDetail', {node: node});
        };
    }
)
    .controller('detailController', function ($scope, $state) {
        $scope.$on('refreshDetail', function (event, data) {
            $scope.node = data.node;
        });
    });