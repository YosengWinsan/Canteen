import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private _userService: UserService, private _router: Router, private _activatedRoute: ActivatedRoute) { }
    username: string = "";
    password: string = "";
    msg: string;
    redirectLink: string;
    ngOnInit() {
        if (this._activatedRoute.snapshot.queryParams["resetStatus"]) {
            this._userService.logout();
        }
        this.msg = "";
        this._activatedRoute.params.subscribe(params => this.redirectLink = params["link"]);
    }
    login() {
        if (this.username != "" && this.password != null) {
            this._userService.login(this.username, this.password).subscribe(rst => {
                if (rst) {
                    if (this.redirectLink)
                        this._router.navigate([this.redirectLink]);
                    else
                        this._router.navigate(["/user/userinfo"]);

                }

                else
                    this.msg = "用户名或密码错误";
            })
        }
    }
    reset() {
        this._router.navigate(['/user/userinfo']);
    }

}
