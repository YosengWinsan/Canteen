import { Component, OnInit } from '@angular/core';
import { CanteenService } from "../canteen.service";

@Component({
  selector: 'app-take-info',
  templateUrl: './take-info.component.html',
  styleUrls: ['./take-info.component.css']
})
export class TakeInfoComponent implements OnInit {

    constructor(private _canteenService: CanteenService) {
        var d = new Date();

        this.dateStart = { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate() }
        this.dateEnd = this.dateStart;
    }
  dinerName: string;
  cardNumber: string;
  dateStart: any;
  dateEnd: any;
  searchResult: any[]=[];
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
      if (ds > de)
      { 
          alert("截止日期不得小于开始日期");
          return;
      }
      this.noResult = false;
      this._canteenService.gettakeinfo(this.cardNumber, this.dinerName, ds, de).subscribe(d => {
      
          this.searchResult = <any[]>d;
         
          if (!this.searchResult.length || this.searchResult.length == 0)
          {
              this.noResult = true;
          }
      });
  }

}
