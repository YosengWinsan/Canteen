import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-net-error',
  templateUrl: './net-error.component.html',
  styleUrls: ['./net-error.component.css']
})
export class NetErrorComponent implements OnInit {

    constructor(private _activatedRoute: ActivatedRoute) { }
    msg: string;
    ngOnInit() {
        this.msg = this._activatedRoute.snapshot.queryParams["msg"];
  }

}
