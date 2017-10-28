import {User} from 'mindweb-request-classes';
import {Http} from '@angular/http';
import {Injectable, resolveForwardRef} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import OpenMapService from './OpenMapService';

/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class UserService {
    static authURL: string = '/auth/authenticated';
    static logoutURL: string = '/auth/logout';

    get currentUser(): User {
        return this._currentUser;
    }

    private _currentUser: User;

    constructor(private http: Http,
                private openMapService:OpenMapService) {
    }

    lookupPromise(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.http.get(UserService.authURL).map(res => res.json() as User).toPromise().then(
                data => {
                    this._currentUser = data;
                    resolve(data);
                }, error => reject(error));
        });
    }

    logoutPromise(): Promise<null> {
        return new Promise<null>((resolve, reject) => {
            this.openMapService.closeAll();
            this.http.get(UserService.logoutURL).toPromise().then(
                data => {
                    delete this._currentUser;
                    resolve();
                },
                error => {
                    delete this._currentUser;
                    resolve(error);
                }
            );
        });
    }
}