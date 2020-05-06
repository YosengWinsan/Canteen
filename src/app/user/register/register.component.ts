import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    constructor(private _userService: UserService, private _router: Router) { }
    msg: string="";
    username: string="";
    password: string="";
    confirmpassword: string="";
    realname: string="";
    ngOnInit() {

    }
    register() {
        if (this.username.length == 0 || this.password.length == 0 || this.realname.length == 0)
        {
            this.msg = "资料不能为空";
            return;
        }
        if (this.confirmpassword != this.password)
        {
            this.msg = "两次密码不一致";
            return;
        }
        this._userService.register(this.username, this.password,this.realname).subscribe(d => {
            if (d.state == 1) {
                alert("注册成功，请登录");
                this._router.navigate(['/user/login']);
            }
            else {
                this.msg = d.msg;
            }

        });
    }
    reset() {
        
        this.username = "";
        this.password = "";
        this.confirmpassword = "";
        this.realname = "";
    }
}
