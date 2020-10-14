import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces
import { CustomerProfile } from 'src/app/interfaces/customer.interface';

// Services
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { CoreService } from 'src/app/services/core.service';
import { API_BASE_URL } from 'src/app/app.config';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit, OnDestroy {
  public userInfo: Object = null;
  public editProfileModalOpen: Boolean = false;

  public currentLoggedInCustomer: CustomerProfile = null;
  public locationPlaceHolder: string = '';
  // Customer Profile form
  public customerProfileFG = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl('', [Validators.required]),
    homeAddress: new FormControl(null, [Validators.required])
  });

  // Change Password
  public changePasswordFG = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', []),
    confirmNewPassword: new FormControl('', [])
  });

  public pwdLength: boolean = false;
  public pwdChar: boolean = false;
  public pwdMatch: boolean = true;

  private _subscriptions: Array<Subscription> = [];

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private coreService: CoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this._subscriptions.push(
      this.authService.getUserObs().subscribe(user => {
        console.log('user ==> ', user);
        if (user) {
          this.currentLoggedInCustomer = user;
          this.customerProfileFG.setValue({
            firstName: this.currentLoggedInCustomer.firstName,
            lastName: this.currentLoggedInCustomer.lastName,
            email: this.currentLoggedInCustomer.email,
            phone: this.currentLoggedInCustomer.phone
              ? this.currentLoggedInCustomer.phone
              : '',
            homeAddress: this.currentLoggedInCustomer.homeAddress
              ? this.currentLoggedInCustomer.homeAddress
              : null
          });

          if (this.currentLoggedInCustomer.homeAddress) {
            const hA = this.currentLoggedInCustomer.homeAddress;
            this.locationPlaceHolder = `${hA['city']} ${hA['state']} ${hA['country']} ${hA['postcode']}`;
          }
        }
      })
    );
    this.authService.getUser();
    // Subscribe to password changes
    this._subscriptions.push(
      this.changePasswordFG.valueChanges.subscribe(value =>
        this.checkPwd(value)
      )
    );
  }

  public closeProfileUploadModal(image) {
    if (image) {
      this.authService.updateUserObs({
        imageThumbnail: image['data'],
        imageId: image._id
      });
    }
    this.editProfileModalOpen = false;
  }

  /**
   * Checks pwd rules
   * @param value pwd fg value
   */
  public checkPwd(value) {
    this.pwdLength = value.newPassword.length > 5;
    const special = RegExp('[^A-Za-z0-9]', 'g').exec(value.newPassword);
    const letters = RegExp('[A-Za-z]', 'g').exec(value.newPassword);
    const numbers = RegExp('[0-9]', 'g').exec(value.newPassword);
    this.pwdChar = !(!special || !letters || !numbers);
    this.pwdMatch = value.newPassword === value.confirmNewPassword;
    // console.log('pwdLength', pwdLength, '  letters : ', letters, ' numbers : ', numbers);
  }
  public submitProfile() {
    this.coreService.validate(this.customerProfileFG);
    if (this.customerProfileFG.valid) {
      this._subscriptions.push(
        this.customerService
          .updateCustomerProfile(this.customerProfileFG.value)
          .subscribe(res => {
            console.log('res ===> ', res);
            this.authService.updateUserObs(res);
          })
      );
    }
  }

  public goBack() {
   this.router.navigate(['', 'customer-portal']);
  }

  // TODO : implement update profile api
  public submitPassword() {
    if (this.changePasswordFG.valid) {
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
