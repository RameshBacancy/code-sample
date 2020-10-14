import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserMessageList } from 'src/app/interfaces/chat.interface';

// Constants
import { userTypes } from 'src/app/app.config';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.scss']
})
export class CustomerHeaderComponent implements OnInit, OnDestroy {
  public userInfo: Object = null;

  public userType: String = userTypes.CUSTOMER;

  public customerMenu: boolean = false;

  public viewSideBar: boolean = false;

  public openMessageWindow: boolean = false;
  public openNotificationWindow: boolean = false;

  public messages: Array<any> = [];
  public notifications: Array<any> = [];
  private _subscriptions = [];

  public showCustomerNotification: boolean = false;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private authSer: AuthService,
    private notificationSer: NotificationService
  ) {}

  ngOnInit() {
    this._subscriptions.push(
      this.authSer.getUserObs().subscribe(user => {
        this.userInfo = user;
        this._subscriptions.push(
          this.notificationSer
            .getNotificationsObs()
            .subscribe((res: Array<any>) => {
              this.notifications = res.filter(_r => _r['read'] === false);
            })
        );
        this._subscriptions.push(
          this.chatService.chatObs().subscribe(chat => {
            if (chat) {
              this.messages = chat.filter(
                _r =>
                  _r['senderId'] !== this.userInfo['_id'] &&
                  _r['markedRead'] === false
              );
            }
          })
        );
      })
    );
  }

  /**
   * Show notification model
   */
  public showAllNotification(event) {
    this.showCustomerNotification = true;
  }

  /**
   * close show all notification model
   */
  public closeModal() {
    this.showCustomerNotification = false;
  }
  /**
   * Navigates to Dashboard
   */
  public toDashboard() {
    this.router.navigate(['', 'customer-portal', 'dashboard']);
  }

  /**
   * Navigates to My Vehicles
   */
  public toMyVehicles() {
    this.router.navigate(['', 'customer-portal', 'my-vehicles']);
  }

  /**
   * Navigates to My Jobs
   */
  public toMyJobs() {
    this.router.navigate(['', 'customer-portal', 'my-jobs']);
  }

  /**
   * Navigates to My Profile
   */
  public toMyProfile() {
    this.router.navigate(['', 'customer-portal', 'my-profile']);
  }

  /**
   * For open customer menu
   */
  public openMenu() {
    this.customerMenu = !this.customerMenu;
  }

  /**
   * Handles AAD logout
   */
  public logout() {
    this.authSer.logOut();
  }

  public openMessageModal() {
    this.openNotificationWindow = false;
    this.openMessageWindow = !this.openMessageWindow;
  }

  public openNotificationModal() {
    this.openMessageWindow = false;
    this.openNotificationWindow = !this.openNotificationWindow;
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  userMessages(event) {}
}
