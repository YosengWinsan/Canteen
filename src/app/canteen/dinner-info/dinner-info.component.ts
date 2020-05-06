import { Component, OnInit,  } from '@angular/core';
import { CanteenService } from '../canteen.service';

@Component({
    selector: 'app-dinner-info',
  templateUrl: './dinner-info.component.html',
  styleUrls: ['./dinner-info.component.css']
})
export class DinnerInfoComponent implements OnInit {

    constructor(private _canteenService: CanteenService, ) {
       
    }
    bookinfo: any[];
    takeinfo: any[];
    todayBookInfo: any;
    takeInBookInfo: any[];
    secondTakeInfo: any[];
    titles: any[];
    ngOnInit() {
        this._canteenService.getbookinfo().subscribe(d => {
            this.bookinfo = d.bookInfo;
            this.titles = this.bookinfo[0].b;
            this.takeinfo = d.takeInfo;
            this.takeInBookInfo = d.takeInBookInfo;
            this.secondTakeInfo = d.secondTakeInfo;
        });
    }
}
