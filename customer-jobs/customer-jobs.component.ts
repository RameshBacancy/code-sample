import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime } from 'rxjs/operators';
import { CustomerJob } from 'src/app/interfaces/customer.interface';
import { CustomerService } from 'src/app/services/customer.service';
import { Observable } from 'rxjs';
import * as dateConvert from 'src/app/core/date-to-dhm/convertToDHM';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-customer-jobs',
  templateUrl: './customer-jobs.component.html',
  styleUrls: ['./customer-jobs.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CustomerJobsComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public cancelTenderOpen: boolean = false;
  public cancelTenderId: any;
  public searchFC = new FormControl('', []);
  public filterFC = new FormControl('open', []);
  public statusOptions = [
    {name: 'Open', value: 'open'},
    {name: 'Booked', value: 'booked'},
    {name: 'Completed', value: 'completed'},
    {name: 'Reviewed', value: 'reviewed'},
  ];
  public dataSource: MatTableDataSource<CustomerJob> = new MatTableDataSource(
    []
  );
  public displayedColumns: Array<string> = [
    'serviceType',
    'location',
    'dateRequired',
    'submissions',
    'action'
  ];
  public dataLength: number = 0;
  public searchTerm: string = '';
  public jobRevieweModalOpen = false;
  private _subscriptions = [];
  public selectedTender;

  public renewModalOpen = false;
  public openSuccesModal = false;
  public filterValue;

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    // Assign sort and paginator fucntion
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // Subscribe to customer jobs
    this._subscriptions.push(
      this.customerService.getCustomerTenderObs().subscribe(jobs => {
        if (jobs) {
          // jobs = jobs.filter(job => job.type === 'serviceEvent');

          this.dataSource.data = jobs;
          this.dataSource.data.forEach(async job => {
            const end = new Date(job.expiresAtEpoch);
            const currentDate = new Date();
            const duration = await dateConvert.convertToDHM(currentDate, end);

            // Check whether the tender has crossed the time limit
            if (duration.day < 0 && duration.hour < 0 && duration.minute < 0) {
              job.tenderClosed = true;
            }
          });

          this.dataLength = jobs.length;
          this.dataSource.filter = this.filterFC.value;
        }
      })
    );
    // Subscribe to searchFC value changes to filter vehicles
    this._subscriptions.push(
      this.searchFC.valueChanges.pipe(debounceTime(300)).subscribe(value => {
        this.searchTerm = value.trim();
        this.dataSource.filter = this.searchTerm;
      })
    );
    this.customerService.getCustomerTenders();
    this.filterValue = this.customerService.getJobSelectedType();
    if (this.filterValue !== undefined) {
      this.filterFC.setValue(this.filterValue);
    }
  }

  public filterTender(opt) {
    this.filterFC.patchValue(opt, { emitEvent: true });
    this.dataSource.filter = opt;
  }

  public selectRow(row, index) {
    this.router.navigate(['customer-portal', 'my-jobs', row._id]);
  }

  /**
   * Navigates to new job
   */
  public addNewJob() {
    this.router.navigate(['', 'customer-portal', 'dashboard']);
  }

  openReviewModal(row, event: Event) {
    event.stopPropagation();
    console.log(row);
    this.selectedTender = row;
    this.jobRevieweModalOpen = true;
  }
  cancelTenderModal() {
    this.cancelTenderOpen = false;
    // this.customerService.getCustomerTenders();
  }

  markTenderComplete(row, event: Event) {
    event.stopPropagation();
    this.customerService
      .markTenderComplete(row._id)
      .subscribe(async updatedTender => {
        this.openSuccesModal = true;
        const index = this.dataSource.data.findIndex(
          tender => tender._id === updatedTender._id
        );

        if (index !== -1) {
          const end = new Date(updatedTender.expiresAtEpoch);
          const currentDate = new Date();
          const duration = await dateConvert.convertToDHM(currentDate, end);
          this.dataSource.data[index] = {
            ...updatedTender,
            tenderClosed: duration.day < 0 && duration.hour < 0 && duration.minute < 0 ? true : false
          };

          this.dataSource.data = this.dataSource.data.slice();
        }
      });
  }

  submitReview(reviewDetails) {
    const data = {
      toId: this.selectedTender.acceptedQuoteBusinessId,
      ...reviewDetails
    };
    this.customerService.submitReview(this.selectedTender._id, data).subscribe(response => {
      this.jobRevieweModalOpen = false;
      this.customerService.getCustomerTenders();
    });
  }

  cancelTender(tender, event) {
    event.stopPropagation();
    this.cancelTenderId = tender._id;
    this.cancelTenderOpen = true;
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openModal(event) {
    event.preventDefault();
    this.jobRevieweModalOpen = true;
    console.log('Opening Modal');
  }

  openRenewModal(row, event: Event) {
    event.stopPropagation();
    this.renewModalOpen = true;
    this.selectedTender = row;
  }

  async closeRenewModal(updatedTender) {
    this.renewModalOpen = false;
    this.selectedTender = null;

    if (updatedTender) {
      const index = this.dataSource.data.findIndex(
        tender => tender._id === updatedTender._id
      );

      if (index !== -1) {
        this.dataSource.data[index] = {
          ...updatedTender,
          tenderClosed: false
        };

        this.dataSource.data = this.dataSource.data.slice();
      }
    }
  }
}
