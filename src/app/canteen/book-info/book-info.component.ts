import { Component, OnInit } from '@angular/core';
import { CanteenService } from "../canteen.service";
import { UserService } from '../../user/user.service';

@Component({
    selector: 'app-book-info',
    templateUrl: './book-info.component.html',
    styleUrls: ['./book-info.component.css']
})
export class BookInfoComponent implements OnInit {

    constructor(private _canteenService: CanteenService,private _userService:UserService) {
        var d = new Date();

        this.dateStart = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
        this.dateEnd = this.dateStart;
    }
    searchResult: any = [];
    dinnerName: string;
    dinerName: string;
    dateStart: any;
    dateEnd: any;
    noResult: boolean = false;
    ngOnInit() {
        
    }
    search() {
        var ds = "2017/01/01";
        var de = "2050/12/31";
        if (this.dateStart)
            ds = this.dateStart.year + "/" + this.dateStart.month + "/" + this.dateStart.day;
        if (this.dateEnd)
            de = this.dateEnd.year + "/" + this.dateEnd.month + "/" + this.dateEnd.day;
        if (ds > de) {
            alert("截止日期不得小于开始日期");
            return;
        }
        this.noResult = false;
        this._canteenService.getbookdetail(this.dinnerName, this.dinerName, ds, de).subscribe(d => {
            this.searchResult = <any[]>d;

            if (!this.searchResult.length || this.searchResult.length == 0) {
                this.noResult = true;
            }
        });
    }

}
