import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerVehiclesComponent } from './customer-vehicles.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerVehiclesComponent,
  },
  {
    path: ':vehicleId',
    component: VehicleDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerVehiclesRoutingModule { }
