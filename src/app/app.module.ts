import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CanteenModule } from './canteen/canteen.module';

import { UserService } from './user/user.service';
import { CanteenService } from './canteen/canteen.service';

import { AuthGuard } from './auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JWTInterceptor } from './user/user.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
      BrowserModule, HttpClientModule, AppRoutingModule, CanteenModule, NgbModule.forRoot()
  ],
  providers: [UserService, CanteenService, AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true,
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
