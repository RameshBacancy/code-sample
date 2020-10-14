import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerVehiclesRoutingModule } from './customer-vehicles-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { CustomerVehiclesComponent } from './customer-vehicles.component';
import { VehiclesBoxComponent } from './vehicles-box/vehicles-box.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';

@NgModule({
  declarations: [CustomerVehiclesComponent, VehiclesBoxComponent, VehicleDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    CustomerVehiclesRoutingModule,
  ]
})
export class CustomerVehiclesModule { }
