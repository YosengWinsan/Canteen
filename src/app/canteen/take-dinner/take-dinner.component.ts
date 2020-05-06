import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CanteenService } from "../canteen.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-take-dinner',
    templateUrl: './take-dinner.component.html',
    styleUrls: ['./take-dinner.component.css']//,
    //host: {'(click)':'onClick($event)'}
})
export class TakeDinnerComponent implements OnInit {

    constructor(private _canteenService: CanteenService) { }
    @ViewChild("inputbox")
    inputbox: ElementRef;
    //cardNumber: string="";
    msg: string = "";
    errMsg: string = "";
    dinners: any;
    cardNumberControl: FormControl = new FormControl();
    noBookTake: boolean = false;
    ngOnInit() {
        this.inputbox.nativeElement.focus();
        //this.cardNumberControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(d => {
        //    if (this.autosubmit && d !== "" && this.dinners.length > 0) {
        //        this.takeDinner(this.dinners[0].id);
        //    }

        //});
        this._canteenService.getDinners().subscribe(d => {
            this.dinners = [];
            let now = new Date();
            let endTime = now.getHours() * 60 + now.getMinutes();
            for (let dinner of d) {
                let time = dinner.dinnerTime.split(':');
                if (endTime < parseInt(time[0]) * 60 + parseInt(time[1]) + 180)
                    this.dinners.push(dinner);
            }
        });
        this._canteenService.getTakeRecord().subscribe(p => {
            this.takerecords = p
        });
    }
    msgTimeout;
    inputTimeout;
    takerecords: any;
    //autosubmit: boolean = false;
    deleteTakeRecord(id) {
        if (confirm("确认删除？")) {
            this.msg = "";
            this._canteenService.deletetakerecord(id).subscribe(d => {
                if (d) {
                    this._canteenService.getTakeRecord().subscribe(p => this.takerecords = p);
                    this.msg = "删除成功";
                }
                else
                    this.errMsg == "删除失败";
            });
        }
    }
    entertotakeDinner() {
        if (this.dinners.length > 0) {
            this.takeDinner(this.dinners[0].id);
        }
        //if (this.dinners.length > 0) {
        //    localStorage.setItem(new Date().valueOf().toString(), this.dinners[0].id);
        //    console.info(localStorage);
        //}
        //localStorage.clear();

    }
    takeDinner(dinnerID) {
        this.inputbox.nativeElement.disabled = true;
        clearTimeout(this.inputTimeout);
        
        this.errMsg = "";
        this.msg = "";
        var cn = this.cardNumberControl.value;

        this.inputTimeout = setTimeout(() => { this.inputbox.nativeElement.disabled = false; this.inputbox.nativeElement.focus(); }, 200);
        this.cardNumberControl.setValue("");
        this.inputbox.nativeElement.focus();
        if (cn == "") {
            this.errMsg = "无法刷卡，卡号无效";
            return;
        }
        if (cn.length != 10) {
            this.errMsg = "无法刷卡，卡号无效";
            return;
        }
        let today =new Date();
        today.setTime(today.getTime() - 1000 * 60 * 60 * 2);
        today.setHours(0, 0, 0, 0);
        //this.msg = "提交中.....";
        this._canteenService.takeDinner(today, dinnerID, cn, this.noBookTake).subscribe(d => {
            if ((<any>d).result === 1) {
                clearTimeout(this.msgTimeout);
                this.msg = "刷卡成功";
                this.msgTimeout = setTimeout(() => {
                    this.msg = "";
                    this._canteenService.getTakeRecord().subscribe(p => this.takerecords = p);
                }, 2000);

            }
            else if ((<any>d).result === -4) {
                this.errMsg = "刷卡失败，无名单";
            }
            else if ((<any>d).result === -2) {
                this.errMsg = "刷卡失败，未预约";
            }
            else if ((<any>d).result === -3) {
                this.errMsg = "刷卡失败 超过三次";
            }
            else {
                this.errMsg = "刷卡失败，请重试";
            }
        });


    }
    @HostListener('click', ['$event'])
    onClick(event) {
        if (event.target.tagName != "button") {
            this.inputbox.nativeElement.focus();
        }
    }
}
