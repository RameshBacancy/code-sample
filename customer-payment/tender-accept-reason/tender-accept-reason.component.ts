import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-tender-accept-reason',
  templateUrl: './tender-accept-reason.component.html',
  styleUrls: ['./tender-accept-reason.component.scss']
})
export class TenderAcceptReasonComponent implements OnInit, OnDestroy {
  // Login modal open
  @Input() open = false;

  // Close login modal
  @Output() close = new EventEmitter();

  @Output() submitReview = new EventEmitter();

  // To signup modal
  @Output() toSignup = new EventEmitter();
  @Input() modalTitle: string = '';
  public reasonFG: FormGroup;

  // Modal min-widths
  @Input() minWidth: string = 'unset';

  // Modal min-height
  @Input() minHeight: string = 'unset';

  @Output() acceptQuote = new EventEmitter();

  public badges = ['Price', 'Time', 'Location', 'Reviews'];

  public showTextArea = false;

  private _subscriptions = [];

  constructor(private fb: FormBuilder, private coreService: CoreService) {}

  ngOnInit() {
    this.reasonFG = this.fb.group({
      reason: new FormControl('', [Validators.required]),
      otherReason: new FormControl('', [Validators.required])
    });

    this._subscriptions.push(
      this.reasonFG.get('reason').valueChanges.subscribe(value => {
        if (value) {
          this.reasonFG.controls['otherReason'].markAsUntouched();
          this.reasonFG.controls['otherReason'].clearValidators();
          this.reasonFG.controls['otherReason'].setErrors(null);
          this.reasonFG.controls['otherReason'].setValue(null);
          this.reasonFG.get('otherReason').updateValueAndValidity();
        } else {
          this.reasonFG.controls['otherReason'].setValidators([Validators.required]);
        }
      })
    );

    this._subscriptions.push(
      this.reasonFG.get('otherReason').valueChanges.subscribe(value => {
        if (value) {
          this.reasonFG.controls['reason'].markAsUntouched();
          this.reasonFG.controls['reason'].clearValidators();
          this.reasonFG.controls['reason'].setErrors(null);
          this.reasonFG.controls['reason'].setValue(null);
          this.reasonFG.get('reason').updateValueAndValidity();
        } else {
          this.reasonFG.controls['reason'].setValidators([Validators.required]);
        }
      })
    );
  }

  handleReasonSelect(reason) {
    this.reasonFG.controls['reason'].setValue(reason);
  }

  handleSubmit() {
    this.coreService.validate(this.reasonFG);
    if (this.reasonFG.valid) {
      this.acceptQuote.emit(this.reasonFG.value);
    }
  }

  handleClose() {
    this.showTextArea = false;
    this.reasonFG.reset();
    this.close.emit(true);
  }

  ngOnDestroy() {
    this.reasonFG.reset();
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
