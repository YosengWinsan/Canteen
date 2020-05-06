import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from "rxjs/Rx";
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { HttpResponse } from "@angular/common/http";
import { Base64 } from "js-base64";
@Injectable()
export class UserService {
    readonly tokenSignal: string = "Token";
    readonly tokenExpireTimeSignal: string = "Token_Expire";
    readonly roleSignal: string = "Role";   
    constructor(private _http: HttpClient, private router: Router) {
        this.loginState = (new Observable<boolean>(
            observer => { UserService.loginStateObserver = observer; observer.next(this.loginStatus()); }));
    } 
    getUserInfo() {
        return this.authGet("/api/token/getuserinfo");
    }
    getrole()
    {
        return sessionStorage.getItem(this.roleSignal);
    }
    static loginStateObserver: Observer<boolean>;
    loginState:  Observable<boolean>;
    login(username: string, password: string) {
        return new Observable(observer =>
            this._http.post<any>("/api/token/gettoken", { name: username, password: password }).subscribe(
                (json) => {
                    if (json.State == 1) {
                      sessionStorage.setItem(this.tokenSignal, json.Data.accessToken);
                      sessionStorage.setItem(this.tokenExpireTimeSignal, JSON.parse(Base64.decode(json.Data.accessToken.split('.')[1])).exp + "000");
                        sessionStorage.setItem(this.roleSignal, JSON.parse(Base64.decode(json.Data.accessToken.split('.')[1])).role);
                        UserService.loginStateObserver.next(true);
                        observer.next(true);
                    }
                    else
                        observer.next(false);
                })
        )
    }
    logout() {
        sessionStorage.removeItem(this.tokenSignal);
        sessionStorage.removeItem(this.tokenExpireTimeSignal);
        sessionStorage.removeItem(this.roleSignal);
        UserService.loginStateObserver.next(false);
    }
    loginStatus() {
        var logined = sessionStorage.getItem(this.tokenSignal) != null && Date.now() < parseInt(sessionStorage.getItem(this.tokenExpireTimeSignal));
        if (logined)
            return logined;
        else
        {
            this.logout();
            return logined;
        }
    }
    private getAuthHeader(): HttpHeaders {
        let token = sessionStorage.getItem(this.tokenSignal);
        if (token == null) {
            this.router.navigate(["/user/login"]);
        }
        var headers = new HttpHeaders();
        headers = headers.append("Authorization", "Bearer " + token);
        return headers;
    }
    checkAndRedirect() {
        let token = sessionStorage.getItem(this.tokenSignal);
        if (token == null) {
            this.router.navigate(["/user/login"]);
            return false;
        }
        else
            return true;
    }
    authGet(url: string) {
        let headers = this.getAuthHeader();
        return this._http.get<any>(url, { headers: headers });//.catch((err) => {console.info(err);return Observable.throw(err);    });

    }
    authPost(url: string, body: any) {
        let headers = this.getAuthHeader();
        return this._http.post(url, body, { headers: headers });//.catch((err) => {console.info(err); return Observable.throw(err);     });
    }
    register(username: string, password: string, realname: string) {
        return this._http.post<any>("api/token/register", { Username: username, Password: password,RealName:realname });
    }

}


@Injectable()
export class JWTInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch((err) => {
               // console.info(err);
                if (err instanceof HttpErrorResponse) {
                    if (err.status == 401) {
                        this.router.navigate(['/user/login'], { queryParams: { resetStatus: true } });
                    }
                    if (err.status == 504)
                        this.router.navigate(['/user/neterror'], { queryParams: { msg: "网络连接错误" } });
                    if (err.status == 403)
                        this.router.navigate(['/user/neterror'], { queryParams: { msg: "无此权限" } });
                }
                return Observable.of(err);
                // Do stuff
            });
    }
}
/*
export class Base64  {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  encode(e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0; e = this._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6;
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64
      } else if (isNaN(i)) {
        a = 64
      }
      t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
    }
    return t;
  }
  decode(e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9+/=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a;
      t = t + String.fromCharCode(n);
      if (u != 64) { t = t + String.fromCharCode(r) }
      if (a != 64) { t = t + String.fromCharCode(i) }
    }
    t = this._utf8_decode(t);
    return t;
  }
  _utf8_encode(e) {
    e = e.replace(/rn/g, "n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192);
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224);
        t += String.fromCharCode(r >> 6 & 63 | 128);
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t;
  }
  _utf8_decode(e) {
    var t = "";
    var n = 0;
    var r = 0;
    var c1 = 0;
    var c2 = 0;
    var c3 = 0;
    while (n < e.length) {
      r = e.charCodeAt(n); if (r < 128) {
        t += String.fromCharCode(r); n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        n += 3
      }
    } return t;
  }
};
*/
