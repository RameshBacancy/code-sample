import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { _Stripe } from 'src/app/app.config';

// Services
import { CustomerService } from 'src/app/services/customer.service';
import { AlertService } from 'src/app/services/alert.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.scss']
})
export class CustomerPaymentComponent implements OnInit, OnDestroy {
  public tenderId: string;
  public quoteId: string;
  private _subscriptions = [];
  public openAcceptModal: Boolean = false;
  public quote: object = null;

  public chargeData: any = null;
  public isLoaded: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private alertSer: AlertService,
    private çustomerService: CustomerService,
    private spinnerSer: SpinnerService
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this.router.paramMap.subscribe(params => {
        this.tenderId = params.get('tenderId');
        this.quoteId = params.get('quoteId');

        this._subscriptions.push(
          this.çustomerService
            .getQuoteById(this.tenderId, this.quoteId)
            .subscribe(this.populateQuote.bind(this))
        );
      })
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // Function to check the validation for the screen
  public get isValid() {
    return true;
  }

  public populateQuote(quote) {
    this.isLoaded = true;
    if (quote) {
      this.quote = quote || null;
    }
  }

  public setChargeData(event) {
    console.log('accepting quote by customer');
    this.chargeData = event;
    this.openAcceptModal = true;

  }

  public async acceptQuote(acceptData) {
    try {
      console.log('accepting quote by customer');
      if (!this.chargeData) {
        return;
      }
      if (!this.chargeData.card || !this.chargeData.intentSecretClientId || this.chargeData.name) {
        return;
      }
      this.spinnerSer.openSpinner();
      const { error, paymentIntent } = await _Stripe.handleCardPayment(
        this.chargeData.intentSecretClientId, this.chargeData.card, {
        payment_method_data: {
          billing_details: { name: 'Test card holder name' }
        }
      }
      );
      this.spinnerSer.closeSpinner();
      if (error) {
        throw error;
      }
      this.çustomerService
        .acceptQuote(this.tenderId, this.quoteId, acceptData)
        .subscribe(data => {
          this.openAcceptModal = false;
          this.route.navigate(['customer-portal']);
        });
    } catch (error) {
      this.alertSer.processError(error);
    }
  }
}
