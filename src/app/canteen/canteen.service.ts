import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
@Injectable()
export class CanteenService {

    constructor(private _http: HttpClient, private _userService: UserService) {
    }
    getDinners()
    {
        return this._http.get<any>("api/canteen/getdinners");
    }
    getDiners()
    {
        return this._userService.authGet("api/canteen/getdiners/0");
        //return this._http.get<any>("api/canteen/getdiners");
    }
    getDeletedDiners() {
      return this._userService.authGet("api/canteen/getdiners/1");
      //return this._http.get<any>("api/canteen/getdiners");
    }
    getDiner(id:string)
    {
        return this._userService.authGet("api/canteen/getdiner/"+id)
    }
    updateDiner(diner)
    {
        return this._userService.authPost("api/canteen/updatediner", diner);
    }
    blukupdateDiner(diners)
    {
        return this._userService.authPost("api/canteen/blukupdatediner", diners);
    }
    book(dinerID, dinnerID, dinnerDate, unBook: boolean = false)
    {
        return this._userService.authPost("api/canteen/book", { dinerID: dinerID, dinnerID: dinnerID, dinnerDate: dinnerDate, unBook: unBook });
    }
    getbookrecord(dinerID)
    {
        return this._userService.authGet("api/canteen/getbookrecord/" + dinerID);
    }
    getbookinfo()
    {
        return this._http.get<any>("api/canteen/getbookinfo");
    }
    takeDinner(date: Date, dinnerID: string, cardNumber: string, noBookTake: boolean) {
        return this._userService.authPost("api/canteen/takedinner", { TakeDate: date, DinnerID: dinnerID, CardNumber: cardNumber, NoBookTake: noBookTake });
    }
    getTakeRecord() {
        return this._userService.authGet("api/canteen/gettakerecords");
    }
    deletetakerecord(id)
    {
        return this._userService.authPost("api/canteen/deletetakerecord/" + id, {});
    }
    getBindDiners() {
        return this._userService.authGet("api/canteen/getbinddiners");
    } 
    getBindDiner(id:string) {
        return this._userService.authGet("api/canteen/getbinddiner/"+id);
    } 
    updateBindDiner( bindName: string, bindIDNumber: string) {
        return this._userService.authPost("api/canteen/bindDiner", { BindName: bindName, BindIDNumber: bindIDNumber});
    }
    getBookableDiners() {
        return this._userService.authGet("api/canteen/getbookablediners");
    }
    unbindDiner(id)
    {
        return this._userService.authPost("api/canteen/unbindDiner/"+id, { });
    }
    gettakeinfo(cn:string,dn:string,dateStart,dateEnd)
    {
        return this._userService.authPost("api/canteen/gettakeinfo", { CardNumber: cn, DinerName: dn, DateStart: dateStart, DateEnd: dateEnd });
    }
    deleteDiner(id:string)
    {
        return this._userService.authGet("api/canteen/deletediner/" + id);
    }
    getbookdetail(dinnerName,dinerName,dateStart,dateEnd)
    {
        return this._userService.authPost("api/canteen/getbookdetail", { DinnerName: dinnerName, DinerName: dinerName, DateStart: dateStart, DateEnd: dateEnd });
    }
    getsettlementinfo(dinerID, yearMonth)
    {
        return this._userService.authPost("api/canteen/getsettlementinfo", { DinerID: dinerID, YearMonth: yearMonth });
    }
    getmonthlyinfo(yearMonth) {
        return this._userService.authPost("api/canteen/getmonthlystatement", {YearMonth: yearMonth });
    }
}
