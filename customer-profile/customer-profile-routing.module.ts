import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerProfileComponent } from './customer-profile.component';
import { CustomerPublicProfileComponent } from './customer-public-profile/customer-public-profile.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerProfileComponent,
  },

  {
    path: 'public-profile',
    component: CustomerPublicProfileComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerProfileRoutingModule { }
