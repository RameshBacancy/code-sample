import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_BASE_URL, calculateDistance } from 'src/app/app.config';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-jobs-business-profile',
  templateUrl: './jobs-business-profile.component.html',
  styleUrls: ['./jobs-business-profile.component.scss']
})
export class JobsBusinessProfileComponent implements OnInit, OnDestroy {
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
  constructor(
    private çustomerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
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
  }

  getQuote() {
    this._subscriptions.push(
      this.çustomerService
        .getQuoteById(this.tenderId, this.quoteId)
        .subscribe(quote => {

          this.quote = quote;
          this.businessProfileId = quote.businessId;

          // First get the site Id to which the quote has been submitted
          const siteId = quote.siteId;

          // Extract the details of the corresponding site from the business's site list
          const requiredAddress = quote.business.siteAddresses.filter(address => address._id === siteId);

          // Check whether a valid site exist
          // Also check whether user has added their address.
          if (requiredAddress.length > 0 && requiredAddress[0].address && this.user.homeAddress) {
            // If yes, calculate the distance of the site from user's location
            const { lat, lng } = requiredAddress[0].address;

            this.distanceFromYou = Math.round(
              calculateDistance(
                lat,
                lng,
                this.user.homeAddress.lat,
                this.user.homeAddress.lng
              )
            );
          }
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

  // acceptQuote(acceptReason) {
  //   this.çustomerService
  //     .acceptQuote(this.tenderId, this.quoteId, acceptReason)
  //     .subscribe(data => {
  //       this.openAcceptModal = false;
  //       this.quote.status = 'accepted';
  //       this.initiatePayment();
  //     });
  // }

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
