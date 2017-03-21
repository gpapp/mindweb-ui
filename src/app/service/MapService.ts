import MapContainer from "mindweb-request-classes/classes/MapContainer";
import {Friend} from "mindweb-request-classes";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {UserService} from "./UserService";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class MapService {
    private _openMaps: Map<string,MapContainer> = new Map();

    constructor(private http: Http, private userService: UserService) {
    }

    get openMaps(): Map<string, MapContainer> {
        return this._openMaps;
    }

    list(): Promise<MapContainer[]> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                this.http.get("/map/maps").map(data => data.json()).toPromise().then((files) => {
                    resolve(files);
                });
            });

        });
    }

    listShared(): Promise<MapContainer[]> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                this.http.get("/map/sharedMaps").map(data => data.json()).toPromise().then((files) => {
                    resolve(files);
                });
            });
        });
    }

    create(name: string, isShareable: boolean, isPublic: boolean, viewers: Friend[], editors: Friend[]): Promise<MapContainer> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({
                    name: name,
                    isShareable: isShareable,
                    isPublic: isPublic,
                    viewers: viewers,
                    editors: editors
                });
                this.http.post("/map/create", body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    share(fileId: string, isShareable: boolean, isPublic: boolean, viewers: Friend[], editors: Friend[]): Promise<MapContainer> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({
                    fileId: fileId,
                    isShareable: isShareable,
                    isPublic: isPublic,
                    viewers: viewers,
                    editors: editors
                });
                this.http.post("/map/share", body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    rename(id: string, newName: string): Promise<MapContainer> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({newName: newName});
                this.http.post("/map/rename/" + id, body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    deleteFile(fileId: string): Promise<MapContainer> {
        return new Promise((resolve, reject) => {
                this.userService.lookupPromise().then(() => {
                    this.http.delete("/map/map/" + fileId).subscribe(
                        data => {
                            this.unRegisterMap(fileId);
                            resolve(data.json())
                        }
                        ,
                        err => {
                            console.error(err);
                            reject(err);
                        }
                    );
                });
            }
        );
    }

    tagQuery(id: string, query: string): Promise < MapContainer > {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({id: id, query: query});
                this.http.post("/map/tagQuery", body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    tag(id: string, tag: string): Promise < MapContainer > {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({id: id, tag: tag});
                this.http.post("/map/tag", body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    exportFreeplane(id: string): Promise < Response > {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                this.http.get('/public/convert/freeplane/' + id).subscribe(
                    data => resolve(data),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    registerMap(file: MapContainer) {
        this._openMaps.set(file.id, file);
    }

    unRegisterMap(fileId: string) {
        this._openMaps.delete(fileId);
    }

}
/*

 private _save(id, changes) {
 var deferred = $q.defer();
 $rootScope.getCurrentUser().then(
 function () {
 $http.put('/map/change/' + id, {actions: changes}).
 success(function (response) {
 deferred.resolve({body: response.data, length: changes.length});
 }).
 error(function (err) {
 deferred.reject(err);
 });
 },
 function () {
 deferred.reject(err);
 });
 return deferred.promise;
 }


 };*/