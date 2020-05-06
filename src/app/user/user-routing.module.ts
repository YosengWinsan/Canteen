import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user.component';
import { DinerEditComponent } from './diner-edit/diner-edit.component';
import { AuthGuard } from '../auth.guard';
import { RegisterComponent } from "./register/register.component";
import { DinerListComponent } from "./diner-list/diner-list.component";
import { DinerBlukUpdateComponent } from "./diner-bluk-update/diner-bluk-update.component";
import { NetErrorComponent } from "./net-error/net-error.component";
import { BindDinerComponent } from "./bind-diner/bind-diner.component";

const routes: Routes = [
    {
        path: '', component: UserComponent, children: [
            { path: '', redirectTo: 'userinfo', pathMatch: 'full' },
            { path: 'userinfo', component: UserInfoComponent, canActivate:[ AuthGuard]},
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'dineredit', component: DinerEditComponent, canActivate: [AuthGuard], data: { roles: ["admin"] } },
            { path: 'dineredit/:id', component: DinerEditComponent, canActivate: [AuthGuard], data: {roles:["admin"]} },
            { path: 'dinerlist', component: DinerListComponent, canActivate: [AuthGuard], data: { roles: ["admin"] } },
            { path: 'dinerblukupdate', component: DinerBlukUpdateComponent, canActivate: [AuthGuard], data: { roles: ["admin"] } },
            { path: 'binddiner', component: BindDinerComponent, canActivate: [AuthGuard], data: { roles: ["admin","user"] } },
            { path: 'binddiner/:id', component: BindDinerComponent, canActivate: [AuthGuard], data: { roles: ["admin", "user"] } },
            { path: 'neterror', component: NetErrorComponent}

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
