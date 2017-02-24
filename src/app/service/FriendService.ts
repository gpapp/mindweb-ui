import Friend from "../classes/Friend";
import {Http, Headers} from "@angular/http";
import {UserService} from "./UserService";
import {Injectable} from "@angular/core";
/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class FriendService {
    private friends: Friend[] = [];

    constructor(public http: Http, private userService: UserService) {
    }

    list(): Friend[] {
        this.userService.lookupPromise().then(() => {
            this.http.get("/friend/list").subscribe(
                data => this.friends = data.json(),
                err => console.error(err)
            )
        });
        return this.friends;
    }

    load(id: string, newName: string): Promise<Friend> {
        return new Promise((resolve, reject) => {
                this.userService.lookupPromise().then(() => {
                    this.http.get("/friend/get/" + id).subscribe(
                        data => {
                            //todo: Close files in rootscope
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

    create(alias: string, linkedUserId: string): Promise<Friend> {
        return new Promise((resolve, reject) => {
                this.userService.lookupPromise().then(() => {
                    const headers = new Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    const body = JSON.stringify({alias: alias, linkedUserId: linkedUserId});
                    this.http.post("/friend/create", body, headers).subscribe(
                        data => {
                            //todo: Close files in rootscope
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

}
/**

 function _update(id, alias, tags) {
            var defer = $q.defer();
            var authURL = '/friend/update';
            $http.put(authURL, {id: id, alias: alias, tags: tags}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

 function _tag(id, tag) {
            var defer = $q.defer();
            var authURL = '/friend/tag';
            $http.put(authURL, {id: id, tag: tag}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

 function _untag(id, tag) {
            var defer = $q.defer();
            var authURL = '/friend/untag';
            $http.put(authURL, {id: id, tag: tag}).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

 function _remove(id, tag) {
            var defer = $q.defer();
            var authURL = '/friend/remove/' + id;
            $http.delete(authURL).then (
                function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.reject();
                });
            return defer.promise;
        }

 **/