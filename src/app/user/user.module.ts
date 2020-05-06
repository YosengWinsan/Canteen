import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';

import { UserComponent } from './user.component';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { DinerEditComponent } from './diner-edit/diner-edit.component';
import { RegisterComponent } from './register/register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DinerListComponent } from './diner-list/diner-list.component';
import { DinerBlukUpdateComponent } from './diner-bluk-update/diner-bluk-update.component';
import { NetErrorComponent } from './net-error/net-error.component';
import { BindDinerComponent } from './bind-diner/bind-diner.component';
@NgModule({
  imports: [
    CommonModule,
      UserRoutingModule, FormsModule,NgbModule
  ],
  declarations: [UserComponent, LoginComponent, UserInfoComponent,  DinerEditComponent, RegisterComponent, DinerListComponent, DinerBlukUpdateComponent, NetErrorComponent,  BindDinerComponent],
  providers:[UserService]
})
export class UserModule { }
