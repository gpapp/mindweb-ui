import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {UserService} from '../service/UserService';
import {Observable} from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(protected router: Router, protected userService: UserService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (!this.userService.currentUser) {
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}