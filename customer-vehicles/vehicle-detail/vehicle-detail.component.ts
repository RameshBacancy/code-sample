import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { serviceTypeOptions, timeframeOptions, lengthOfTenderOptions, serviceTypes} from 'src/app/app.config';
import { ServiceTypes } from 'src/app/interfaces/customer.interface';
import { CoreService } from 'src/app/services/core.service';
import { CustomerService } from 'src/app/services/customer.service';
import { AlertService } from 'src/app/services/alert.service';
import { VehicleDetails } from 'src/app/interfaces/customer.interface';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VehicleDetailComponent implements OnInit, OnDestroy {

  constructor(
    private router: ActivatedRoute,
    private navigationRouter: Router,
    private fb: FormBuilder,
    private coreService: CoreService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private route: Router,
    ) { }

  public vehicleDetails: VehicleDetails;

  private vehicleId: string;

  public service_history = [
    {
      date: '22/10/2017',
      type: 'Full service',
      distance: '25,152 km'
    },
    {
      date: '22/10/2017',
      type: 'Full service',
      distance: '25,152 km'
    },
    {
      date: '22/10/2017',
      type: 'Full service',
      distance: '25,152 km'
    },
    {
      date: '22/10/2017',
      type: 'Full service',
      distance: '25,152 km'
    },
  ];

  public serviceVehicleFG: FormGroup;
  public serviceTypeOptions: Array<object> = serviceTypeOptions;
  public timeframeOptions: Array<object> = timeframeOptions;
  public lengthOfTenderOptions: Array<object> = lengthOfTenderOptions;

  private _subscriptions = [];

  public rangeOptions = {
    step: 5,
    showTicks: true,
    ceil: 50
  };

  public serviceTypes: ServiceTypes = serviceTypes;

  ngOnInit() {
    this.serviceVehicleFG = this.fb.group({
      address: new FormControl('', [Validators.required]),
      locationRange: new FormControl(10, [Validators.required]),
      // registrationNumber: new FormControl('', [Validators.required]),
      serviceType: new FormControl('Logbook service', [Validators.required]),
      timeframe: new FormControl('asap', [Validators.required]),
      lengthOfTender: new FormControl(24, [Validators.required]),
      resourceId: new FormControl(null, [Validators.required]),
      additionalComments: new FormControl(''),
    });

    this.getVehicleDetail();
    // Add otherService formcontrol if 'other' is selected as the service type
    this._subscriptions.push(
      this.serviceVehicleFG.get('serviceType').valueChanges.subscribe(value => {
        if (value === this.serviceTypes.Other) {
          this.serviceVehicleFG.addControl(
            'otherService',
            new FormControl('Road Worthy Inspection', Validators.required)
          );

          this._subscriptions.push(
            this.serviceVehicleFG.get('otherService').valueChanges.subscribe(val => {
              if (val === 'Something else') {
                this.serviceVehicleFG.addControl(
                  'otherServiceDescription',
                  new FormControl('', [Validators.required])
                );
              } else {
                this.serviceVehicleFG.removeControl('otherServiceDescription');
              }
            })
          );
        } else {
          this.serviceVehicleFG.removeControl('otherService');
        }
      })
    );

    this._subscriptions.push(
      this.serviceVehicleFG.get('timeframe').valueChanges.subscribe(value => {
        if (value === 'certainDate') {
          this.serviceVehicleFG.addControl(
            'requestedTime',
            new FormControl('', Validators.required)
          );
        } else {
          this.serviceVehicleFG.removeControl('requestedTime');
        }
      })
    );

  }

  // Get vehicle detail
  public getVehicleDetail() {
    this._subscriptions.push(this.router.paramMap.subscribe(params => {
      this.vehicleId = params.get('vehicleId');

      this._subscriptions.push(this.customerService.getCustomerVehicleDetails(this.vehicleId).subscribe(
        data => {
          this.vehicleDetails = data;
          this.serviceVehicleFG.get('resourceId').setValue(data._id);
        },
        error => {
          console.log('vehcle details error', error);
        }
      ));
    }));
  }

  public getUpdatedDetail(event) {
    // if (event && event !== true) {
    //   this.getVehicleDetail();
    // }
  }

  public toNewJob() {
    this.coreService.validate(this.serviceVehicleFG);
    if (this.serviceVehicleFG.valid && this.vehicleDetails && this.vehicleDetails.basicDetails) {

      const {_id, ...requiredVehicleDetail} = this.vehicleDetails.basicDetails;
      const tenderDetails =  {
          ...this.serviceVehicleFG.value,
          ...requiredVehicleDetail,
          requestedTime: new Date(this.serviceVehicleFG.value.requestedTime).getTime()

      };

      this.customerService
        .addCustomerTender(tenderDetails)
        .then(
          data => this.route.navigate(['customer-portal', 'my-jobs']),
          err => this.alertService.pushError(err.error.message)
        );
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
