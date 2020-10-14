import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerJobsRoutingModule } from './customer-jobs-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { CustomerJobsComponent } from './customer-jobs.component';
import { NewJobComponent } from './new-job/new-job.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobsBusinessProfileComponent } from './jobs-business-profile/jobs-business-profile.component';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
// import { TenderAcceptReasonComponent } from './tender-accept-reason/tender-accept-reason.component';
import { TenderRejectReasonComponent } from './tender-reject-reason/tender-reject-reason.component';
import { JobsBusinessOrderSummaryProfileComponent } from './jobs-business-order-summary-profile/jobs-business-order-summary-profile.component';

@NgModule({
  declarations: [
    CustomerJobsComponent,
    NewJobComponent,
    JobDetailComponent,
    CustomerReviewComponent,
    JobsBusinessProfileComponent,
    // TenderAcceptReasonComponent,
    TenderRejectReasonComponent,
    JobsBusinessOrderSummaryProfileComponent
  ],
  imports: [CommonModule, CoreModule, CustomerJobsRoutingModule]
})
export class CustomerJobsModule {}
