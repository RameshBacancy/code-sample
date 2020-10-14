import { Component, OnInit, OnDestroy } from '@angular/core';

// Services
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-customer-portal',
  templateUrl: './customer-portal.component.html',
  styleUrls: ['./customer-portal.component.scss']
})
export class CustomerPortalComponent implements OnInit, OnDestroy {

  constructor(
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.chatService.startPolingNotifications();
  }

  ngOnDestroy() {
    this.chatService.stopPollingNotification();
  }

}
