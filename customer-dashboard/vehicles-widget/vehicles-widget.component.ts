import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vehicle } from 'src/app/interfaces/customer.interface';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles-widget',
  templateUrl: './vehicles-widget.component.html',
  styleUrls: ['./vehicles-widget.component.scss']
})
export class VehiclesWidgetComponent implements OnInit, OnDestroy {

  public vehicles: Vehicle[] = [];
  public vehiclesLoaded: boolean = false;
  public title: string = 'My vehicles';
  public buttontext: string = 'Add a vehicle';
  public vehicleModalOpen: boolean = false;

  public vehicleData: Vehicle;
  private _subscriptions = [];


  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit() {
    this._subscriptions.push(this.customerService.getCustomerVehiclesObs().subscribe(
      vehicles => {
        if (vehicles) {
          this.vehicles = vehicles;
          this.vehiclesLoaded = true;
        }
      },
    ));
    this.customerService.getCustomerVehicles();
  }

  goToVehicleDetail(vehicleId: string) {
    this.router.navigate(['customer-portal', 'my-vehicles', vehicleId]);
  }

  public vehicleModelOpen() {
    this.vehicleModalOpen = true;
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

