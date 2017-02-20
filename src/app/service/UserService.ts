import User from "../classes/User";
import {Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

/**
 * Created by gpapp on 2015.05.15..
 */
@Injectable()
export class UserService {
    static authURL: string = '/auth/authenticated';
    static logoutURL: string = '/auth/logout';

    private _authenticationDone: boolean = false;
    private _currentUser: User;

    constructor(private http: Http) {
    }

    lookup(): Promise<User> {
        if (this._authenticationDone) {
            return new Promise((resolve) => {
                resolve(this._authenticationDone);
            });
        }
        return this.http.get(UserService.authURL).map(res => {
            this._authenticationDone = true;
            return res.json() as User
        }).toPromise().catch((error) => {
            this._authenticationDone = true;
            return error;
        });
    }

    logout(): Promise<User> {
        this._authenticationDone = true;
        delete this._currentUser;
        return this.http.get(UserService.logoutURL).map(res => res.json()).toPromise().catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            errMsg = `${error.status} - ${error.statusText || ''} ${error.text()}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);

    }
}