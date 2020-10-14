import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from 'src/app/interfaces/customer.interface';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-vehicles-box',
  templateUrl: './vehicles-box.component.html',
  styleUrls: ['./vehicles-box.component.scss']
})
export class VehiclesBoxComponent implements OnInit {

  @Input() vehicle: Vehicle;
  @Output() data = new EventEmitter<any>();

  public items = [{ name: 'Edit', value: 'edit' }, { name: 'Detail', value: 'detail' }, { name: 'Delete', value: 'delete' }];
  public editModelOpen: boolean = false;
  public vehicleModalOpen: boolean = false;
  public reasonForDelete: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.reasonForDelete = this.fb.group({
      deleteReason: ['', Validators.required]
    });
  }

  public dropDownOutputAction(value, type, selectedIndex = null) {
    console.log('value ==> ', value);
    switch (type) {
      case 'edit':
        if (value === 'edit') {
          this.editModelOpen = true;
        } else if (value === 'detail') {
          this.router.navigate(['customer-portal', 'my-vehicles', this.vehicle._id]);
        } else if (value === 'delete') {
          this.vehicleModalOpen = true;
        }
        break;
    }
  }

  // close the model pop up
  closeDeleteModal() {
    this.vehicleModalOpen = false;
    this.data.emit(true);
  }

  public closeModal(data = null) {
    this.editModelOpen = false;
  }

  goToVehicleDetail(vehicleId: string, event) {
    if (!event.target.classList.contains('mat-dropdown-image')) {
      this.router.navigate(['customer-portal', 'my-vehicles', vehicleId]);
    }
  }

  // When submit the for delete customer vehicle
  public submitReason() {
    if (this.reasonForDelete.valid) {
      this.customerService
        .deleteCustomerVehicle(this.vehicle._id)
        .then(
          () => this.closeDeleteModal(),
          err => this.alertService.pushError(err.error.message)
        );
    }
  }
}
