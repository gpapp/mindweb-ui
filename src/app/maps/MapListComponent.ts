import {Component, OnInit, TemplateRef} from '@angular/core';
import {Routes, Router} from '@angular/router';
import {UserService} from '../service/UserService';
import {MapService} from '../service/MapService';
import MapContainer from 'mindweb-request-classes/classes/MapContainer';
import {TemplateComponent} from '../layout/TemplateComponent';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import OpenFileModule from '../service/OpenMapService';
import ViewerComponent from '../viewer/ViewerComponent';

const appRoutes: Routes = [
    {path: 'map', component: ViewerComponent},
];
@Component({
    providers: [UserService, MapService],
    templateUrl: '../../templates/maps/MapList.html'
})
export class MapListComponent implements OnInit {

    get loadingFiles(): boolean {
        return this._loadingFiles;
    }

    get files(): MapContainer[] {
        return this._files;
    }

    get loadingSharedFiles(): boolean {
        return this._loadingSharedFiles;
    }

    get sharedFiles(): MapContainer[] {
        return this._sharedFiles;
    }

    get target(): MapContainer {
        return this._target;
    }

    set target(value: MapContainer) {
        this._target = value;
        this._target['newName'] = value.name.replace(/.mm$/, '');
        this._target['newEditors'] = value.editors;
        this._target['newViewers'] = value.viewers;
        this._target['newIsPublic'] = value.isPublic;
        this._target['newIsShareable'] = value.isShareable;
    }

    private _files: MapContainer[] = [];
    private _loadingFiles: boolean = true;
    private _sharedFiles: MapContainer[] = [];
    private _loadingSharedFiles: boolean = true;
    private _target: MapContainer;

    constructor(private modalService: NgbModal,
                private fileService: MapService,
                private openfileModule: OpenFileModule,
                private root: TemplateComponent,
                private router: Router) {
    }

    open(dialog: TemplateRef<any>) {
        let newFileName: string = 'New file.mm';
        let counter: number = 0;
        if (this._files) {
            let done: boolean = false;
            do {
                done = true;
                for (let i in this._files) {
                    if (this._files[i].name === newFileName) {
                        done = false;
                        counter++;
                        newFileName = 'New file (' + counter + ').mm';
                        break;
                    }
                }
            } while (!done);
        }
        this.target = new MapContainer();
        this.target.name = newFileName;
        this.modalService.open(dialog, {size: 'lg'}).result.then((result: File) => {
            for (let i in this._files) {
                if (this._files[i].name === result['newName'] + '.mm') {
                    this.root.errorMsg = 'File name \'' + newFileName + '\' already exists';
                    return;
                }
            }
            this.fileService.create(result['newName'],
                result['newIsShareable'],
                result['newIsPublic'],
                null, null).then(() => {
                this.refreshFiles();
            }).catch((error) => {
                this.root.errorMsg = error;
            });
        }, (reason) => {
        });
    }

    ngOnInit(): void {
        this.refreshFiles();
    }

    refreshFiles() {
        this.fileService.list().then(
            files => {
                this._loadingFiles = false;
                return this._files = files
            },
            error => this.root.errorMsg = error);
        this.fileService.listShared().then(
            files => {
                this._loadingSharedFiles = false;
                return this._sharedFiles = files
            },
            error => this.root.errorMsg = error);
    }
}
/*
 .config(['$stateProvider',
 function ($stateProvider) {
            $stateProvider
                .state('maps', {
                    abstract: true,
                    url: '/maps',
                    template: '<section ui-view></section>',
                    data: {
                        requireLogin: true // this property will apply to all children of 'app'
                    }
                })
                .state('maps.list', {
                    url: '',
                    templateUrl: 'app/maps/MapList.html',
                    controller: 'fileController'
                })
        }
 ])
 .controller('fileController', function ($rootScope, $scope, $http, $uibModal, $location, $state, Upload, MapService) {
        $scope.loadingFiles = false;
        $scope.loadingSharedFiles = false;
        reloadFiles();

        var uploadMutex = false;
        $scope.$watch('uploadedFiles', function () {
            if (!uploadMutex) {
                uploadMutex = true;
                $scope.upload($scope.uploadedFiles);
            }
        });
        $scope.uploads = {};
        $scope.upload = function (toUpload) {
            if (toUpload && toUpload.length) {
                for (var i = 0; i < toUpload.length; i++) {
                    var file = toUpload[i];
                    $scope.uploads[file.name] = {name: file.name, max: file.size, value: 0, done: false, error: false};
                    Upload.upload({
                        url: '/file/upload',
                        method: 'POST',
                        fields: {'username': $scope.username},
                        file: file
                    }).progress(function (evt) {
                        $scope.uploads[evt.config.file.name].value = evt.loaded;
                    }).success(function (data, status, headers, config) {
                        $scope.uploads[config.file.name].done = true;
                        $scope.uploads[config.file.name].error = status != 200;
                        reloadFiles();
                        uploadMutex = false;
                    }).error(function (data, status, headers, config) {
                        $scope.uploads[config.file.name].error = true;
                        $scope.uploads[config.file.name].errorMsg = 'ERROR';
                        uploadMutex = false;
                    })
                    ;
                }
            } else {
                uploadMutex = false;
            }
        };

        $scope.openCreateModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'file_create_modal.html',
                controller: 'fileActionController',
                resolve: {
                    target: function () {
                        return {
                            name: '',
                            description: '',
                            version: 0,
                            isPublic: true,
                            creationDate: 'New',
                            modificationDate: 'New'
                        };
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                MapService.create(selectedItem.newName, selectedItem.newIsPublic).then(function (data) {
                    $scope.maps.push(data);
                });
            });
        };

        $scope.downloadFreeplane = function (target) {
            MapService.exportFreeplane(target.id).then(
                function (data) {
                    var blob = new Blob([data], {type: 'application/x-freemind'});
                    saveAs(blob, target.name);
                },
                function (error) {
                    alert('Cannot save file:' + error);
                }
            )
        };

        $scope.openShareModal = function (target) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'file_share_modal.html',
                controller: 'fileActionController',
                resolve: {
                    target: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                MapService.share(
                    selectedItem.id,
                    selectedItem.newIsShareable,
                    selectedItem.newIsPublic,
                    selectedItem.newViewers,
                    selectedItem.newEditors).then(function (data) {
                    for (var i = 0; i < $scope.maps.length; i++) {
                        if (data.id === $scope.maps[i].id) {
                            $scope.maps[i] = data;
                        }
                    }
                });
            });
        };
        $scope.openRenameModal = function (target) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'file_rename_modal.html',
                controller: 'fileActionController',
                resolve: {
                    target: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                MapService.rename(selectedItem.id, selectedItem.newName).then(function (data) {
                    target.name = data.name;
                });
            });
        };
        $scope.openDeleteModal = function (target) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'file_delete_modal.html',
                controller: 'fileActionController',
                resolve: {
                    target: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                MapService.remove(selectedItem.id).then(function () {
                    $scope.maps.splice($scope.maps.indexOf(target), 1);
                });
            });
        };

        $scope.loadTags = function (file, query) {
            return MapService.tagQuery(file.id, query);
        };

        $scope.tag = function (file, mytag) {
            MapService.tag(file.id, mytag.text).then(function (data) {
                file = data;
            });
        };



        $scope.linkToClipboard = function () {
            $rootScope.$emit('$applicationInfo', 'URL copied to clipboard');
        };

        $scope.untag = function (file, mytag) {
            MapService.untag(file.id, mytag.text).then(function (data) {
                file = data;
            });
        };

        $scope.fileOpen = function (file) {
            $state.go('viewer.file', {fileId: file.id});
        };

        $scope.fileClose = function (file) {
            $rootScope.$emit('closeFile', file);
        };

        // Utility functions for controller
        function reloadFiles() {
            $rootScope.getCurrentUser().then(
                function (data) {
                    if (!data) return;
                    $scope.loadingFiles = true;
                    MapService.list().then(function (data) {
                            $scope.maps = data;
                            $scope.loadingFiles = false;
                        },
                        function (data) {
                            $rootScope.$emit('$applicationError', 'Cannot load file list');
                        });
                    $scope.loadingSharedFiles = true;
                    MapService.listShared().then(function (data) {
                            $scope.sharedFiles = data;
                            $scope.loadingSharedFiles = false;
                        },
                        function () {
                            $rootScope.$emit('$applicationError', 'Cannot load shared file list');
                        });
                }
            );
        }
    })
 .controller('fileActionController', function ($scope, $uibModalInstance, target) {
        $scope.target = target;
        $scope.target.newName = $scope.target.name.replace(new RegExp('^(.*)\.mm$'), '$1');
        $scope.target.newIsShareable = $scope.target.isShareable;
        $scope.target.newIsPublic = $scope.target.isPublic;
        $scope.target.newViewers = $scope.target.viewers;
        $scope.target.newEditors = $scope.target.editors;

        $scope.ok = function () {
            $uibModalInstance.close($scope.target);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
 */