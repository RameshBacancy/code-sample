import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerProfileRoutingModule } from './customer-profile-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { CustomerProfileComponent } from './customer-profile.component';
import { CustomerPublicProfileComponent } from './customer-public-profile/customer-public-profile.component';

@NgModule({
  declarations: [CustomerProfileComponent, CustomerPublicProfileComponent],
  imports: [
    CommonModule,
    CoreModule,
    CustomerProfileRoutingModule,
  ]
})
export class CustomerProfileModule { }
