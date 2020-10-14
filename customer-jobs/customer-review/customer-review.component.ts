import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { businessReviews } from 'src/app/app.config';

const initialBadges = businessReviews;

@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CustomerReviewComponent implements OnInit, OnDestroy {
  // Login modal open
  @Input() open = false;

  // Close login modal
  @Output() close = new EventEmitter();

  @Output() submitReview = new EventEmitter();

  // To signup modal
  @Output() toSignup = new EventEmitter();
  @Input() modalTitle: string = '';
  public userDetailsFG: FormGroup;

  // Modal min-widths
  @Input() minWidth: string = 'unset';

  // Modal min-height
  @Input() minHeight: string = 'unset';

  public badges = initialBadges.map(badge => ({ ...badge }));

  public showDescription = false;

  constructor(private fb: FormBuilder, private coreService: CoreService) {}

  ngOnInit() {
    this.userDetailsFG = this.fb.group({
      summary: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      rating: new FormControl(0)
    });
  }

  handleRating(val) {
    this.userDetailsFG.controls['rating'].setValue(val);
  }

  handleBadgeClick(selectedBadge) {
    this.badges = this.badges.map(badge => {
      return {
        ...badge,
        selected:
          badge.label === selectedBadge
            ? badge['selected']
              ? false
              : true
            : badge['selected']
      };
    });
  }

  handleSubmit() {
    this.coreService.validate(this.userDetailsFG);
    if (this.userDetailsFG.valid) {
      const values = this.userDetailsFG.value;
      const selectedBadges = this.badges.filter(
        badge => badge['selected'] === true
      );
      values['badges'] = selectedBadges.map(badge => badge.label);
      this.submitReview.emit(values);
    }
  }

  handleClose() {
    this.close.emit(true);
    this.showDescription = false;
    this.badges = initialBadges.map(badge => ({ ...badge }));
    this.userDetailsFG.reset();
  }

  ngOnDestroy() {
    this.badges = initialBadges.map(badge => ({ ...badge }));
    this.userDetailsFG.reset();
  }
}
