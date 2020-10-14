import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { timeframeOptions, serviceTypeOptions } from 'src/app/app.config';
import { Subscription, timer } from 'rxjs';

// Services
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  private _subscriptions: Array<Subscription> = [];
  public serviceVehicleFG: FormGroup;

  public timeframeOptions: Array<object> = timeframeOptions;
  public serviceTypeOptions: Array<object> = serviceTypeOptions;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private coreService: CoreService
  ) { }

  ngOnInit() {
    this.serviceVehicleFG = this.fb.group({
      address: new FormControl('', [Validators.required]),
      // timeframe: new FormControl('asap', [Validators.required]),
      registrationNumber: new FormControl('', [Validators.required]),
      // serviceDate: new FormControl(new Date(2019, 10, 21), []),
      serviceType: new FormControl('Logbook service', [Validators.required])
    });
  }

  /**
   * Navigates to new job
   */
  public toNewJob() {
    this.coreService.validate(this.serviceVehicleFG);
    if (this.serviceVehicleFG.valid) {
      localStorage.setItem(
        'customerService',
        JSON.stringify(this.serviceVehicleFG.value)
      );
      this.router.navigate(['', 'customer-portal', 'my-jobs', 'new-job']);
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach(_s => _s.unsubscribe());
  }

}
