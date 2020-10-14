import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_BASE_URL, calculateDistance } from 'src/app/app.config';
import { AuthService } from 'src/app/services/auth.service';
import { Marker } from 'src/app/interfaces/customer.interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-jobs-business-order-summary-profile',
  templateUrl: './jobs-business-order-summary-profile.component.html',
  styleUrls: ['./jobs-business-order-summary-profile.component.scss']
})
export class JobsBusinessOrderSummaryProfileComponent implements OnInit, OnDestroy {

  public jobRevieweModalOpen: boolean = false;
  public quoteId: string;
  public tenderId: string;
  public quote: any;
  public openAcceptModal = false;
  public openRejectModal = false;
  public businessProfileId: string;
  public user: any;
  private _subscriptions = [];
  public distanceFromYou: any = null;
  public markers: Marker[] = [];
  public lat: number = 51.673858;
  public lng: number = 7.815982;
  public messageFG: FormGroup;
  public submittedMessage: boolean = false;
  public messageModalOpen: boolean = false;
  public confirmationModel: boolean = false;
  public cancelBooking: boolean = false;
  public confirmCancellationModel: boolean = false;
  public conversations: Array<any> = [];
  public transactionFee: number = 2;
  public totalAmount: number;

  constructor(
    private çustomerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private chatService: ChatService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
      this.quoteId = params.get('quoteId');
      this._subscriptions.push(
        this.authService.getUserObs().subscribe(user => {
          if (user) {
            this.user = user;
            this.getQuote();
          }
        })
      );
    });
    this.messageFG = this.fb.group({
      message: new FormControl('', [Validators.required])
    });
  }

  get g() { return this.messageFG.controls; }

  public submitMessage() {
    this.submittedMessage = true;
    if (this.messageFG.valid) {
      this.messageModalOpen = false;
        if (this.messageFG.get('message').value.trim().length > 0) {
          const message = {
            receiverId: this.quote.businessId,
            receiverType: this.quote.business['type'],
            content: this.messageFG.get('message').value,
            tenderId: this.quote.tenderId,
            quoteId: this.quoteId,
            resourceId: null
          };
          this._subscriptions.push(
            this.chatService.sendMessage(message).subscribe(res => {
              this.conversations.push({
                ...message,
                messageType: 'send',
                createdAt: new Date(),
                markedRead: true
              });
              this.messageFG.reset();
              this.confirmationModel = true;
            }, console.log)
          );
        }
    }
  }

  public closeConfirmationModel() {
    this.confirmationModel = false;
  }

  public closeConfirmCancellationModel() {
    this.confirmCancellationModel = false;
  }

  public backTotheOrderSummary() {
    this.messageModalOpen = false;
  }

  public messageToMechanic() {
    this.messageModalOpen = true;
  }

  public cancelBookingOrder() {
    this.cancelBooking = false;
  }

  public confirmCancelBookingOrder() {
    this.cancelBooking = false;
    this.confirmCancellationModel = true;
    this.çustomerService.deleteTender(this.quote.tenderId).then(
      () => {
        this.confirmCancellationModel = false;
        this.router.navigate(['', 'customer-portal', 'my-jobs']);
      },
      err => this.alertService.pushError(err.error.message)
    );
  }

  public closeMessageModal() {
    this.messageModalOpen = false;
  }

  public canceledBooking() {
    this.cancelBooking = true;
  }

   // TO get the map default cordinates
   public get defaultMapCords() {
    if (this.markers.length === 0) {
      if (this.quote) {
        return {
          lat: this.quote.business.mainAddress.lat,
          lng: this.quote.business.mainAddress.lng
        };
      }
      return {
        lat: this.lat,
        lng: this.lng
      };
    }
    return {
      lat: this.markers[this.markers.length - 1].lat,
      lng: this.markers[this.markers.length - 1].lng
    };
  }

  // Function to populate siteAddress of in business in map
  private populateMapMarkers(quotes) {
      if (quotes['business']) {
        // First extract the business's available sites and the siteId from which the quote was posted
        const { business: { siteAddresses = []}= {}, siteId} = quotes;

        // Now extract the lat and lng of the corresponding siteId and push it to marker
        siteAddresses.forEach((_add, i) => {
          if (siteId === _add._id && _add.address) {
            this.markers.push({
              lat: _add.address.lat ,
              lng: _add.address.lng,
              label: _add.address.city,
              draggable: false
            });
          }
        });
      }
  }

  getQuote() {
    this._subscriptions.push(
      this.çustomerService
        .getQuoteById(this.tenderId, this.quoteId)
        .subscribe(quote => {

          this.quote = quote;
          this.businessProfileId = quote.businessId;
          this.transactionFee = (quote.estimatedAmount * this.transactionFee) / 100;
          this.totalAmount = this.transactionFee + quote.estimatedAmount;
          const { lat, lng } = quote.business.mainAddress;
          if (this.user.homeAddress) {
            this.distanceFromYou = Math.round(
              calculateDistance(
                lat,
                lng,
                this.user.homeAddress.lat,
                this.user.homeAddress.lng
              )
            );
          }
          this.populateMapMarkers(this.quote);
        })
    );
  }

  openReviewModal() {
    this.jobRevieweModalOpen = true;
  }

  submitReview(reviewDetails) {
    const data = {
      toId: this.quote.businessId,
      ...reviewDetails
    };
    this.çustomerService.submitReview(this.tenderId, data).subscribe(response => {
      this.jobRevieweModalOpen = false;
      this.router.navigate(['customer-portal', 'my-jobs']);
    });
  }

  rejectQuote(rejectReason) {
    this.çustomerService
      .rejectQuote(this.tenderId, this.quoteId, rejectReason)
      .subscribe(data => {
        this.openRejectModal = false;
        this.quote.status = 'rejected';
        this.router.navigate(['', 'customer-portal', 'my-jobs']);
      });
  }

  acceptQuote(acceptReason) {
    this.çustomerService
      .acceptQuote(this.tenderId, this.quoteId, acceptReason)
      .subscribe(data => {
        this.openAcceptModal = false;
        this.quote.status = 'accepted';
        this.initiatePayment();
      });
  }

  initiatePayment() {
    this.router.navigate([
      '',
      'customer-portal',
      'tender',
      this.tenderId,
      'quote',
      this.quoteId,
      'payment'
    ]);
  }

  closeModal() {
    this.openAcceptModal = false;
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
