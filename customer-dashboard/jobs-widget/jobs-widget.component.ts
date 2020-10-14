import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-jobs-widget',
  templateUrl: './jobs-widget.component.html',
  styleUrls: ['./jobs-widget.component.scss']
})
export class JobsWidgetComponent implements OnInit, OnDestroy {

  public imgPath: string = '/assets/images/my_jobs.png';
  public tendersLoaded: boolean = false;
  public tenders = [];
  public tenderSearch = [];
  private _subscriptions = [];
  public filterFC = new FormControl('open', []);
  public statusOptions = [
    {name: 'Open', value: 'open'},
    {name: 'Booked', value: 'booked'},
    {name: 'Completed', value: 'completed'}
  ];
  public img;
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this._subscriptions.push(this.customerService.getCustomerTenderObs().subscribe(
      tenders => {
        if (tenders) {
          tenders = tenders.filter(tender => tender.type === 'serviceEvent');
          this.tenders = tenders;
          this.tendersLoaded = true;
          this.tenders.filter = this.filterFC.value;
          this.getImage(this.filterFC.value);
          this.tenderSearch = [];
          this.tenders.forEach(tender => {
            if (tender.status === this.tenders.filter) {
            this.tenderSearch.push(tender);
            }
          });
        }
      },
    ));
    this.customerService.getCustomerTenders();
  }

  public filterTender(opt) {
    this.filterFC.patchValue(opt, { emitEvent: true });
    this.tenders.filter = opt;
    this.getImage(opt);
    this.tenderSearch = [];
    this.tenders.forEach(tender => {
      if (tender.status === opt) {
        this.tenderSearch.push(tender);
      }
    });
  }

  public getImage(value) {
    if (value === 'open') {
      this.img = './assets/icons/available-violet.svg';
      this.img = this.sanitizer.bypassSecurityTrustStyle('url(' + this.img + ')');
    } else if (value === 'booked') {
      this.img = './assets/icons/book-violet.svg';
      this.img = this.sanitizer.bypassSecurityTrustStyle('url(' + this.img + ')');
    } else {
      this.img = './assets/icons/check-circle-violet.svg';
      this.img = this.sanitizer.bypassSecurityTrustStyle('url(' + this.img + ')');
    }
  }

  scrollTop() {
    let top = document.getElementById('customer-dashboard');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  goToAppropriateJob() {
    this.customerService.setJobSelectedType(this.tenders.filter);
    this.router.navigate(['', 'customer-portal', 'my-jobs']);
  }

  goToJobDetail(tenderId: string) {
    this.router.navigate(['', 'customer-portal', 'my-jobs', tenderId]);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
