import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-chat',
  templateUrl: './customer-chat.component.html',
  styleUrls: ['./customer-chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerChatComponent implements OnInit, OnDestroy {
  public searchUserFC = new FormControl('', [Validators.required]);

  private _subscriptions: Array<Subscription> = [];

  public entityId: string;
  public entityType: string;

  constructor(private activatedRoutes: ActivatedRoute) {}
  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  ngOnInit() {
    if (this.activatedRoutes.children.length) {
      this._subscriptions.push(
        this.activatedRoutes.children[0].params.subscribe(
          this.processRoutes.bind(this)
        )
      );
    }
  }
  private processRoutes(_params = {}) {
    this.entityId = _params['id'];
    this.entityType = _params['type'];
  }
}
