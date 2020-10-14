import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-customer-notifications',
  templateUrl: './customer-notifications.component.html',
  styleUrls: ['./customer-notifications.component.scss']
})
export class CustomerNotificationsComponent implements OnInit {
  @Input() public showUnreadNotification: boolean;
  @Input() public totalUnreadNotification: number;

  constructor() {}

  ngOnInit() {}
}
