import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-tender-reject-reason',
  templateUrl: './tender-reject-reason.component.html',
  styleUrls: ['./tender-reject-reason.component.scss']
})
export class TenderRejectReasonComponent implements OnInit {
  // Login modal open
  @Input() open = false;

  // Close login modal
  @Output() close = new EventEmitter();

  // @Output() submitReview = new EventEmitter();

  // To signup modal
  @Output() toSignup = new EventEmitter();
  @Input() modalTitle: string = '';
  public reasonFG: FormGroup;

  // Modal min-widths
  @Input() minWidth: string = 'unset';

  // Modal min-height
  @Input() minHeight: string = 'unset';

  @Output() rejectQuote = new EventEmitter();

  public badges = ['Price', 'Time', 'Location', 'Reviews'];

  public showTextArea = false;

  constructor(private fb: FormBuilder, private coreService: CoreService) { }

  ngOnInit() {
    this.reasonFG = this.fb.group({
      reason: new FormControl('', [Validators.required]),
      otherReason: new FormControl('')
    });
  }

  handleReasonSelect(reason) {
    this.reasonFG.controls['reason'].setValue(reason);
  }

  handleSubmit() {
    this.coreService.validate(this.reasonFG);
    if (this.reasonFG.valid) {
      this.rejectQuote.emit(this.reasonFG.value);
    }
  }

  handleClose() {
    this.showTextArea = false;
    this.reasonFG.reset();
    this.close.emit(true);
  }

}
