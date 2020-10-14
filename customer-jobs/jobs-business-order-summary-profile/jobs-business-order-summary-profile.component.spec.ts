import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsBusinessOrderSummaryProfileComponent } from './jobs-business-order-summary-profile.component';

describe('JobsBusinessOrderSummaryProfileComponent', () => {
  let component: JobsBusinessOrderSummaryProfileComponent;
  let fixture: ComponentFixture<JobsBusinessOrderSummaryProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsBusinessOrderSummaryProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsBusinessOrderSummaryProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(true).toBe(false);
  });
});
