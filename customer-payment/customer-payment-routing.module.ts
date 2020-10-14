import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPaymentComponent } from './customer-payment.component';

const routes: Routes = [
  {
    path: ':tenderId/quote/:quoteId/payment',
    component: CustomerPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPaymentRoutingModule {}
