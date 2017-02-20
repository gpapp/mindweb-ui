import File from "../classes/File";
import Friend from "../classes/Friend";
import {Http, Headers, Response} from "@angular/http";
import {UserService} from "./UserService";
import {Injectable} from "@angular/core";
/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class FileService {
    private files: File[] = [];
    private sharedFiles: File[] = [];
    private _openFiles: Map<string,File> = new Map();

    constructor(private http: Http, private userService: UserService) {
    }

    get openFiles(): Map<string, File> {
        return this._openFiles;
    }

    list(): File[] {
        this.userService.lookup().then(() => {
            this.http.get("/file/files").subscribe(
                data => this.files = data.json(),
                err => console.error(err)
            )
        });
        return this.files;
    }

    listShared() {
        this.userService.lookup().then(() => {
            this.http.get("/file/sharedFiles").subscribe(
                data => this.sharedFiles = data.json(),
                err => console.error(err)
            )
        });
        return this.sharedFiles;
    }

    create(name: string, isShareable: boolean, isPublic: boolean, viewers: Friend[], editors: Friend[]): Promise<File> {
        return new Promise((resolve, reject) => {
            this.userService.lookup().then(() => {
                const headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                const body = JSON.stringify({
                    name: name,
                    isShareable: isShareable,
                    isPublic: isPublic,
                    viewers: viewers,
                    editors: editors
                });
                this.http.post("/file/create", body, headers).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject();
                    }
                )
            });
        });
    }

    share(fileId: string, isShareable: boolean, isPublic: boolean, viewers: Friend[], editors: Friend[]): Promise<File> {
        return new Promise((resolve, reject) => {
            this.userService.lookup().then(() => {
                const headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                const body = JSON.stringify({
                    name: name,
                    isShareable: isShareable,
                    isPublic: isPublic,
                    viewers: viewers,
                    editors: editors
                });
                this.http.post("/file/share", body, headers).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject();
                    }
                )
            });
        });
    }

    rename(id: string, newName: string): Promise<File> {
        return new Promise((resolve, reject) => {
            this.userService.lookup().then(() => {
                const headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                const body = JSON.stringify({newName: newName});
                this.http.post("/file/rename/" + id, body, headers).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject();
                    }
                )
            });
        });
    }

    delete(fileId: string): Promise<File> {
        return new Promise((resolve, reject) => {
                this.userService.lookup().then(() => {
                    this.http.delete("/file/file/" + fileId).subscribe(
                        data => {
                            this.unRegisterFile(fileId);
                            resolve(data.json())
                        }
                        ,
                        err => {
                            console.error(err);
                            reject();
                        }
                    );
                });
            }
        );
    }

    tagQuery(id: string, query: string): Promise < File > {
        return new Promise((resolve, reject) => {
            this.userService.lookup().then(() => {
                const headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                const body = JSON.stringify({id: id, query: query});
                this.http.post("/file/tagQuery", body, headers).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject();
                    }
                )
            });
        });
    }

    tag(id: string, tag: string): Promise < File > {
        return new Promise((resolve, reject) => {
            this.userService.lookup().then(() => {
                const headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                const body = JSON.stringify({id: id, tag: tag});
                this.http.post("/file/tag", body, headers).subscribe(
                    data => resolve(data.json()),
                    err => {
                        console.error(err);
                        reject();
                    }
                )
            });
        });
    }

    exportFreeplane(id: string): Promise < Response > {
        return new Promise((resolve, reject) => {
            this.userService.lookup().then(() => {
                this.http.get('/file/convert/freeplane/' + id).subscribe(
                    data => resolve(data),
                    err => {
                        console.error(err);
                        reject();
                    }
                )
            });
        });
    }

    registerFile(file: File) {
        this._openFiles.set(file.id, file);
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
 deferred.reject();
 });
 return deferred.promise;
 }


 };*/