import { Component, OnInit } from '@angular/core';
import { CanteenService } from '../canteen.service';

@Component({
  selector: 'app-monthly-statement',
  templateUrl: './monthly-statement.component.html',
  styleUrls: ['./monthly-statement.component.css']
})
export class MonthlyStatementComponent implements OnInit {

    constructor(private _canteenService: CanteenService) { }
    diners;
    titles;
    yearMonths: number[];
    selectedDiner = "";
    selectedYearMonth;
    info;
    ngOnInit() {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let ym: number[] = [];
        this.selectedYearMonth = year * 100 + month;
        for (let i = 0; i < 6; i++) {
            ym.push(year * 100 + month);
            month--;
            if (month == 0) {
                year--;
                month = 12;
            }
        }
        this.yearMonths = ym;

        this._canteenService.getBookableDiners().subscribe(data => {
            this.diners = data;
            if (data.length > 0) {
                this.selectedDiner = data[0].id;
                this.selectDiner();
            }
            else
                alert("未绑定用餐者，请先进入个人信息界面绑定");
        });
    }
    selectDiner() {
        this.search();

    }
    search() {
        if (this.selectedDiner !== "") {
            this._canteenService.getmonthlyinfo(this.selectedYearMonth).subscribe(d => {
                this.info = d;
                this.titles = d[0].i;
            });
        }
        //this._canteenService.getsettlementinfo()
    }
}
