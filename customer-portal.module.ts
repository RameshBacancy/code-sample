import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerPortalRoutingModule } from './customer-portal-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { CustomerPortalComponent } from './customer-portal.component';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';

import { CustomerNotificationsComponent } from './customer-notifications/customer-notifications.component';

@NgModule({
  declarations: [
    CustomerPortalComponent,
    CustomerHeaderComponent,
    CustomerNotificationsComponent
  ],
  imports: [CommonModule, CoreModule, CustomerPortalRoutingModule]
})
export class CustomerPortalModule {}
