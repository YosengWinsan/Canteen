import { Component, OnInit } from '@angular/core';
import { UserService} from './user/user.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Hello World app';
    values: any;
    navbarCollapsed: boolean=true ;
    constructor(private userService: UserService) {

    }
    loginStatus: boolean;
    showAdminMenu: boolean;
    ngOnInit() {
        this.userService.loginState.subscribe(d => { this.loginStatus = d; this.showAdminMenu = this.userService.getrole()=='admin' });
    }
    logout() {
        this.userService.logout();
    }
  
}
