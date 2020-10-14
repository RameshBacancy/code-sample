import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerProfile } from 'src/app/interfaces/customer.interface';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-customer-public-profile',
  templateUrl: './customer-public-profile.component.html',
  styleUrls: ['./customer-public-profile.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CustomerPublicProfileComponent implements OnInit, OnDestroy {
  public customerPublicProfile: CustomerProfile;
  public maxRecordToDisplay: number = 3;
  private _subscriptions = [];

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this._subscriptions.push(this.customerService.getCustomerPublicProfileObs().subscribe(
      customerProfile => {
        if (customerProfile) {
          this.customerPublicProfile = customerProfile;
        }
      },
    ));
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
