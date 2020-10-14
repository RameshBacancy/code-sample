import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Vehicle } from 'src/app/interfaces/customer.interface';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-customer-vehicles',
  templateUrl: './customer-vehicles.component.html',
  styleUrls: ['./customer-vehicles.component.scss']
})
export class CustomerVehiclesComponent implements OnInit, OnDestroy {

  public vehicleModalOpen: boolean = false;
  public searchFC = new FormControl('', []);
  public vehicles: Vehicle[] = [];
  public allVehicles: Vehicle[] = [];
  public vehiclesLoaded: boolean = false;

  private searchTerm: string = '';

  private _subscriptions = [];

  constructor(
    private router: Router,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.getVehicleLists();
  }

  // get the list of customer vehicles
  getVehicleLists() {
    // Subscribe to customer vehicles
    this._subscriptions.push(this.customerService.getCustomerVehiclesObs().subscribe(
      vehicles => {
        if (vehicles) {
          this.allVehicles = vehicles;
          // this.filterVehicles();
          this.vehiclesLoaded = true;
        }
      },
    ));
    this.vehicles = this.allVehicles;
    // Subscribe to searchFC value changes to filter vehicles
    this._subscriptions.push(this.searchFC.valueChanges.pipe(debounceTime(300)).subscribe(
      value => {
        this.searchTerm = value.trim();
        this.filterVehicles();
      },
    ));
    this.customerService.getCustomerVehicles();
  }

  // get added Vehicles detail
  getVehiclesDetail(event) {
    this.getVehicleLists();
  }

  /**
   * Opens vehicle modal
   */
  public vehicleModelOpen() {
    this.vehicleModalOpen = true;
  }

  /**
   * Filters vehicles
   */
  private filterVehicles() {
    this.vehicles = this.allVehicles.filter(veh => {
      const keys = Object.keys(veh);
      for (let i = 0; i < keys.length; i++) {
        if (veh[keys[i]].toUpperCase().indexOf(this.searchTerm.toUpperCase()) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  public handleVehicleClick(vehicleId) {
    this.router.navigate(['', 'customer-portal', 'my-vehicles', vehicleId]);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
