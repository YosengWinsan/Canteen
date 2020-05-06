import { Component, OnInit } from '@angular/core';
import { CanteenService } from "../../canteen/canteen.service";

@Component({
    selector: 'app-diner-bluk-update',
    templateUrl: './diner-bluk-update.component.html',
    styleUrls: ['./diner-bluk-update.component.css']
})
export class DinerBlukUpdateComponent implements OnInit {

    constructor(private _canteenService: CanteenService) { }
    data: string;
    ngOnInit() {
    }
    blukupdate() {
        var diners = [];
        var items = this.data.split("\n");
        for (let itemIndex in items) {
            let item = items[itemIndex].split(",");
            diners.push({ Name: item[1], CardNumber: item[0],IDNumber:item[2] });
        }
        this._canteenService.blukupdateDiner(diners).subscribe(d => {
            if (d)
                alert("导入成功");
            else
                alert("导入失败");
        });

    }
}
