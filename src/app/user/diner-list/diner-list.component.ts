import { Component, OnInit } from '@angular/core';
import { CanteenService } from "../../canteen/canteen.service";

@Component({
  selector: 'app-diner-list',
  templateUrl: './diner-list.component.html',
  styleUrls: ['./diner-list.component.css']
})
export class DinerListComponent implements OnInit {

    constructor(private _canteenService:CanteenService) { }
    diners: any[];
    listDeleted: boolean;
  ngOnInit() {
      this.diners = [];
      this.listDeleted = false;
      this.load();
      //this._canteenService.getDiners().subscribe(data => this.diners = data);
  }
  list() {
    this.listDeleted = !this.listDeleted;
    this.load();
  }
  load() {
    if (!this.listDeleted)
      this._canteenService.getDiners().subscribe(data => this.diners = data);
    else
    this._canteenService.getDeletedDiners().subscribe(data => this.diners = data);
  }

}
