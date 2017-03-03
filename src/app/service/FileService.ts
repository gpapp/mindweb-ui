import File from "mindweb-request-classes/dist/classes/File";
import Friend from "mindweb-request-classes/dist/classes/Friend";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {UserService} from "./UserService";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class FileService {
    private _openFiles: Map<string,File> = new Map();

    constructor(private http: Http, private userService: UserService) {
    }

    get openFiles(): Map<string, File> {
        return this._openFiles;
    }

    list(): Promise<File[]> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                this.http.get("/file/files").map(data => data.json()).toPromise().then((files) => {
                    resolve(files);
                });
            });

        });
    }

    listShared(): Promise<File[]> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                this.http.get("/file/sharedFiles").map(data => data.json()).toPromise().then((files) => {
                    resolve(files);
                });
            });
        });
    }

    create(name: string, isShareable: boolean, isPublic: boolean, viewers: Friend[], editors: Friend[]): Promise<File> {
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
                this.http.post("/file/create", body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    share(fileId: string, isShareable: boolean, isPublic: boolean, viewers: Friend[], editors: Friend[]): Promise<File> {
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
                this.http.post("/file/share", body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    rename(id: string, newName: string): Promise<File> {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({newName: newName});
                this.http.post("/file/rename/" + id, body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    deleteFile(fileId: string): Promise<File> {
        return new Promise((resolve, reject) => {
                this.userService.lookupPromise().then(() => {
                    this.http.delete("/file/file/" + fileId).subscribe(
                        data => {
                            this.unRegisterFile(fileId);
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

    tagQuery(id: string, query: string): Promise < File > {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({id: id, query: query});
                this.http.post("/file/tagQuery", body, options).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject(err);
                    }
                )
            });
        });
    }

    tag(id: string, tag: string): Promise < File > {
        return new Promise((resolve, reject) => {
            this.userService.lookupPromise().then(() => {
                const options = new RequestOptions({
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                });
                const body = JSON.stringify({id: id, tag: tag});
                this.http.post("/file/tag", body, options).subscribe(
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

    registerFile(file: File) {
        this._openFiles.set(file.id.toString(), file);
    }

    unRegisterFile(fileId: string) {
        this._openFiles.delete(fileId);
    }

}
/*

 private _save(id, changes) {
 var deferred = $q.defer();
 $rootScope.getCurrentUser().then(
 function () {
 $http.put('/file/change/' + id, {actions: changes}).
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