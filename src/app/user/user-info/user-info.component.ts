import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CanteenService } from "../../canteen/canteen.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

    constructor(private _userService: UserService, private _canteenService: CanteenService,private _router:Router) { }
    username: any;
    realname: string;
    expiresTime: Date;
    bindDiners: any[];
    showBindDiner: boolean = false;
    ngOnInit() {
        this._userService.getUserInfo().subscribe(data =>
        {
            this.username = data.Data.name;
            this.expiresTime = new Date(parseInt(data.Data.expiresTime + "000"));
            this.realname = data.Data.realname;
        });
        if (this._userService.getrole() != 'canteen') {
            this.showBindDiner = true;
            this._canteenService.getBindDiners().subscribe(d => this.bindDiners = d);
        }

  }
    logout()
    {
        this._userService.logout();
        this._router.navigate(['/user/login']);
    }

    unbindDiner(id)
    {
        if (confirm("确定要删除绑定？"))
        {
            this._canteenService.unbindDiner(id).subscribe(d =>
            {
                if (d)
                {
                    this._canteenService.getBindDiners().subscribe(d => this.bindDiners = d);
                }
            });
        }
    }
}
