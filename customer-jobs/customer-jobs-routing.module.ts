import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerJobsComponent } from './customer-jobs.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { NewJobComponent } from './new-job/new-job.component';
import { MsalGuard } from '@azure/msal-angular';
import { JobsBusinessProfileComponent } from './jobs-business-profile/jobs-business-profile.component';
import { JobsBusinessOrderSummaryProfileComponent } from './jobs-business-order-summary-profile/jobs-business-order-summary-profile.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerJobsComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'tender/:tenderId/quotes/:quoteId/business-profile',
    component: JobsBusinessProfileComponent,
    // canActivate: [MsalGuard]
  },
  {
    path: 'acceptedtender/:tenderId/quotes/:quoteId/business-profile',
    component: JobsBusinessOrderSummaryProfileComponent,
    // canActivate: [MsalGuard]
  },
  {
    path: 'new-job',
    component: NewJobComponent,
    // canActivate: [MsalGuard]
  },
  {
    path: ':id',
    component: JobDetailComponent,
    canActivate: [MsalGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerJobsRoutingModule { }
