import User from "../classes/User";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
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

    private _currentUser: User;

    constructor(private http: Http) {
    }

    lookupPromise(): Promise<User> {
        return this.http.get(UserService.authURL).map(res => res.json() as User).toPromise();
    }

    logoutPromise(): Promise<null> {
        delete this._currentUser;
        return this.http.get(UserService.logoutURL).toPromise();

    }
}