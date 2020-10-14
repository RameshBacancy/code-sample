import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { Marker } from 'src/app/interfaces/customer.interface';
import { MatTableDataSource } from '@angular/material';
import * as dateConvert from 'src/app/core/date-to-dhm/convertToDHM';
import { shortLengthId } from 'src/app/app.config';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobDetailComponent implements OnInit {
  public tenderId: string;
  public displayTenderId: string;
  public tenderQuotes: any;
  public lat: number = 51.673858;
  public lng: number = 7.815982;
  public tender: any;
  public dataLength: number = 0;
  public quotesDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: Array<string> = [
    'Business',
    'Service',
    'Location',
    'Quote',
    'Date Submitted',
    'Quotes'
  ];

  public timeleftOnTender: string;

  public markers: Marker[] = [];
  public renewModalOpen = false;
  public tenderQuotation = {};
  public isJobRevieweModalOpen = false;

  public icon = {
    url: '/assets/icons/marker-img.png',
    scaledSize: {
      width: 69,
      height: 35
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('id');
      this.displayTenderId = shortLengthId(this.tenderId);
      this.customerService.getTenderById(this.tenderId).subscribe(
        async tender => {
          this.tender = tender;
          if (tender.status === 'completed') {
            this.isJobRevieweModalOpen = true;
          }
          this.processTenderRemainingTime(tender);
          const index = this.tender.quotes.findIndex(_quote => _quote['tenderId'] === this.tenderId);
          this.tenderQuotation = this.tender.quotes[index];
          tender.quotes = tender.quotes.filter(
            quote =>
              !(this.tender.status === 'booked' && quote.status === 'rejected')
          );
          this.quotesDataSource.data = tender.quotes;
          this.dataLength = tender.quotes.length;
          this.populateMapMarkers(tender.quotes);
        },
        err => console.log
      );
    });
  }

  // public get timeDiff() {
  //   console.log(this.tender.timeleftOnTender);
  //   return this.tender ? this.tender.timeleftOnTender : 'Null';
  // }

  // TO get the map default cordinates
  public get defaultMapCords() {
    if (this.markers.length === 0) {
      if (this.tender) {
        return {
          lat: this.tender.address.lat,
          lng: this.tender.address.lng
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
  private populateMapMarkers(quotes: Array<any> = []) {
    quotes.forEach((_quote, _i) => {
      if (_quote.business) {
        const { siteAddresses = [], mainAddress = {} } = _quote.business;
        if (siteAddresses && siteAddresses.length > 0) {
          siteAddresses.forEach((_add, i) => {
            if (_quote.siteId === _add._id) {
              this.markers.push({
                lat: _add.address ? _add.address['lat'] : undefined,
                lng: _add.address ? _add.address['lng'] : undefined,
                label: `$${_quote.estimatedAmount}`,
                draggable: false,
                quoteId: _quote._id
              });
            }
          });
        }
        console.log('_quote ===> ', _quote);
        // this.markers.push({
        //   lat: mainAddress['lat'],
        //   lng: mainAddress['lng'],
        //   label: `$${_quote.estimatedAmount}`,
        //   draggable: false,
        //   quoteId: _quote._id
        // });
      }
    });
  }

  selectRow(row, i) {
    this.redirectToQuoteDetailPage(row._id, i);
  }

  submitReview(reviewDetails) {
    const data = {
      toId: this.tender.acceptedQuoteBusinessId,
      ...reviewDetails
    };
    this.customerService.submitReview(this.tender._id, data).subscribe(response => {
      this.isJobRevieweModalOpen = false;
      this.customerService.getCustomerTenders();
    });
  }

  // updateLengthOfTender($event) {
  //   $event.preventDefault();
  //   if (this.tender) {
  //     const createdDate = new Date(this.tender.createdAt);
  //     const currentDate = new Date();
  //     const duration = dateConvert.convertToDHM(createdDate, currentDate);
  //     let newLengthOfTender = duration.day * 24;
  //     newLengthOfTender += duration.hour;
  //     newLengthOfTender += this.tender.lengthOfTender;
  //     this.customerService.updateLengthOfTender(this.tenderId, newLengthOfTender).subscribe(tender => {
  //       this.processTenderRemainingTime(tender);
  //     });
  //   }
  // }

  public async processTenderRemainingTime(tender) {
    this.tender.lengthOfTender = tender.lengthOfTender;
    const end = new Date(tender.expiresAtEpoch);
    const currentDate = new Date();
    const duration = await dateConvert.convertToDHM(currentDate, end);
    this.tender.timeleftOnTender = `${duration.day} d : ${duration.hour} hr : ${duration.minute} min`;
    this.tender.tenderEndDate = end;

    // Check whether the tender has crossed the time limit
    if (duration.day < 0 && duration.hour < 0 && duration.minute < 0) {
      this.tender.tenderClosed = true;
    } else {
      this.tender.tenderClosed = false;
    }
  }

  async closeReviewModal(updatedTender) {
    this.renewModalOpen = false;
    if (updatedTender) {
      this.processTenderRemainingTime(updatedTender);
    }
  }

  public onMarkerClick(quote) {
    this.redirectToQuoteDetailPage(quote.quoteId);
  }

  private redirectToQuoteDetailPage(quoteId, index?: number) {
    if (this.tender.quotes[index].status === 'accepted' && this.tender.quotes[index].paymentSuccessful === true) {
      this.router.navigate([
        '',
        'customer-portal',
        'my-order-summary',
        'acceptedtender',
        this.tenderId,
        'quotes',
        quoteId,
        'business-profile'
      ]);
    } else {
      this.router.navigate([
        '',
        'customer-portal',
        'my-jobs',
        'tender',
        this.tenderId,
        'quotes',
        quoteId,
        'business-profile'
      ]);
    }
  }
}
