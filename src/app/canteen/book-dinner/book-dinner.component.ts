import { Component, OnInit, ViewChildren, ElementRef, Renderer2, QueryList } from '@angular/core';
import { CanteenService } from '../canteen.service';

@Component({
  selector: 'app-book-dinner',
  templateUrl: './book-dinner.component.html',
  styleUrls: ['./book-dinner.component.css']
})
export class BookDinnerComponent implements OnInit {

    constructor(private _canteenService: CanteenService, private _renderer: Renderer2) {
        this.bookrecords = [];
    }
    dinners: any[];
    bookableDays: Date[];
    diners: any[];
    selectedDiner: any;
    bookrecords: any[];
    nowTime: number;
    @ViewChildren('buttonElement') buttons: QueryList<ElementRef>;

    ngOnInit() {
        let now = new Date();
        this.nowTime = now.valueOf();
        now.setHours(0, 0, 0, 0);
        this.bookableDays = new Array<Date>();
        this.bookableDays.push(now);
        for (let i = 1; i < 10; i++) {
            this.bookableDays.push(new Date(now.getTime() + i * 86400000));
        }
        this._canteenService.getDinners().subscribe(data => {
            this.dinners = data;
            for (let dinner of this.dinners)
            {
                let time = dinner.dinnerTime.split(':');
                dinner.dinnerTime = ((parseInt(time[0])-1) * 60 * 60 + 60 * parseInt(time[1]) + parseInt(time[2]))*1000;
            }

            this._canteenService.getBookableDiners().subscribe(data => {
                this.diners = data;
                if (data.length > 0) {
                    this.selectedDiner = data[0].id;
                    this.selectDiner(this.selectedDiner);
                }
                else
                    alert("未绑定用餐者，请先进入个人信息界面绑定");
            });
        });

    }
    recordTimeout;
    book(dinnerID, dinnerDate: Date, ele: any) {
        if (!this.selectedDiner)
        { alert("未选择用餐者"); return;}
        this._canteenService.book(this.selectedDiner, dinnerID, dinnerDate, ele.booked).subscribe(data => {
            if (data) {
                clearTimeout(this.recordTimeout);
                ele.booked = !ele.booked;
                this.recordTimeout = setTimeout(() => this.selectDiner(this.selectedDiner), 2000);
            }
        });
    }
    selectDiner(id) {
        this._canteenService.getbookrecord(id).subscribe(data => {

            this.bookrecords = data;
            let findRecordIndex: number;
            let i: number;
            if (this.buttons.length > 0) {
                this.buttons.forEach(p => {
                    findRecordIndex = -1;
                    i = 0;
                    for (let record of this.bookrecords) {

                        if (p.nativeElement.id == record.dinnerID + "/" + Date.parse(record.dinnerDate.replace(/-/g, "/").replace(/T/, " "))) {
                            findRecordIndex = i;
                            break;
                        }
                        i++;
                    }
                    if (findRecordIndex > -1) {
                        this._renderer.setProperty(p.nativeElement, "booked", true);
                        //this._renderer.setStyle(p.nativeElement, "color", "red");
                        this.bookrecords.splice(findRecordIndex, 1);
                    }
                    else
                        this._renderer.setProperty(p.nativeElement, "booked", false);
                        //this._renderer.setStyle(p.nativeElement, "color", "black");
                });
            }

        });
    }

}
