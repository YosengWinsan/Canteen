import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user/user.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _userService: UserService, private _router: Router) {

    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this._userService.loginStatus())
            if (next.data.roles) {
                if (next.data.roles.indexOf(this._userService.getrole()) < 0) {
                    this._router.navigate(['/user/neterror'], { queryParams: { msg: "无此权限" } });
                    return false;
                }
                else
                    return true;
            }
            else
                return true;
        else {
            this._router.navigate(['/user/login', { link: state.url }]);
            return false;
        }
        //return true;
    }
}
