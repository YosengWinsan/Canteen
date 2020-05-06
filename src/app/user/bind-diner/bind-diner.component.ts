import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CanteenService } from "../../canteen/canteen.service";
import { UserService } from "../user.service";

@Component({
    selector: 'app-bind-diner',
    templateUrl: './bind-diner.component.html',
    styleUrls: ['./bind-diner.component.css']
})
export class BindDinerComponent implements OnInit {

    constructor(private _router: Router, private _canteenService: CanteenService, private _activatedRoute: ActivatedRoute, private _userService: UserService) {
        this.admin = _userService.getrole() == "admin";
    }
    admin: boolean=false;
    bindName: string = "";
    bindIDNumber: string = "";
    //dinerName: string="";
    //dinerID: string;
    id:string;
    ngOnInit() {
        //this._activatedRoute.params.subscribe(d => {
        //    if (d["id"])
        //    {
        //        this.id = d["id"];
        //        this._canteenService.getBindDiner(this.id).subscribe(k => {
        //            console.info(k);
        //            this.bindName = k.bindName;
        //            this.bindIDNumber = k.bindIDNumber;
        //            //this.dinerName =k.dinerName;
        //        })
        //    }
        //});
    }
    save() {
        if (this.bindName !== "" && this.bindIDNumber.length == 6)
            this._canteenService.updateBindDiner(this.bindName, this.bindIDNumber).subscribe(d => {
                if (d) {
                    alert("绑定成功");
                    this.back();
                }
                else
                    alert("绑定失败，请检查所输入的信息");
            });
        else
            alert("身份信息不准确");
    }
    back() {
        this._router.navigate(['user/userinfo']);
    }

}
