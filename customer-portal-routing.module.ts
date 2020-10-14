import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPortalComponent } from './customer-portal.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./customer-dashboard/customer-dashboard.module').then(m => m.CustomerDashboardModule)
      },
      {
        path: 'my-vehicles',
        loadChildren: () => import('./customer-vehicles/customer-vehicles.module').then(m => m.CustomerVehiclesModule)
      },
      {
        path: 'my-jobs',
        loadChildren: () => import('./customer-jobs/customer-jobs.module').then(m => m.CustomerJobsModule)
      },
      {
        path: 'my-order-summary',
        loadChildren: () => import('./customer-jobs/customer-jobs.module').then(m => m.CustomerJobsModule)
      },
      {
        path: 'my-profile',
        loadChildren: () => import('./customer-profile/customer-profile.module').then(m => m.CustomerProfileModule)
      },
      {
        path: 'tender',
        loadChildren: () => import('./customer-payment/customer-payment.module').then(m => m.CustomerPaymentModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./customer-chat/customer-chat.module').then(m => m.CustomerChatModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPortalRoutingModule {}
