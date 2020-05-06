import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanteenRoutingModule } from './canteen-routing.module';
import { DinnerInfoComponent } from './dinner-info/dinner-info.component';
import { BookDinnerComponent } from './book-dinner/book-dinner.component';
import { CanteenComponent } from './canteen.component';
import { TakeDinnerComponent } from './take-dinner/take-dinner.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TakeInfoComponent } from './take-info/take-info.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { SettlementComponent } from './settlement/settlement.component';
import { MonthlyStatementComponent } from './monthly-statement/monthly-statement.component';
@NgModule({
  imports: [
    CommonModule,
      CanteenRoutingModule, FormsModule, NgbModule, ReactiveFormsModule
  ],
  declarations: [DinnerInfoComponent, BookDinnerComponent, CanteenComponent, TakeDinnerComponent, TakeInfoComponent, BookInfoComponent, SettlementComponent, MonthlyStatementComponent, ]
})
export class CanteenModule { }
