import { CoreModule } from './../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDashboardRoutingModule } from './customer-dashboard-routing.module';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { VehiclesWidgetComponent } from './vehicles-widget/vehicles-widget.component';
import { JobsWidgetComponent } from './jobs-widget/jobs-widget.component';

@NgModule({
  declarations: [CustomerDashboardComponent, VehiclesWidgetComponent, JobsWidgetComponent],
  imports: [
    CommonModule,
    CoreModule,
    CustomerDashboardRoutingModule
  ]
})
export class CustomerDashboardModule { }
