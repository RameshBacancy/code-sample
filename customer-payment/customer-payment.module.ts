import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerPaymentRoutingModule } from './customer-payment-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { CustomerPaymentComponent } from './customer-payment.component';

import { TenderAcceptReasonComponent } from './tender-accept-reason/tender-accept-reason.component';

@NgModule({
  declarations: [
    CustomerPaymentComponent,
    TenderAcceptReasonComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    CustomerPaymentRoutingModule,
  ]
})
export class CustomerPaymentModule { }
