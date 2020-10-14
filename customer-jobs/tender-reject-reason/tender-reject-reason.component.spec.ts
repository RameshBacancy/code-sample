import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderRejectReasonComponent } from './tender-reject-reason.component';

describe('TenderRejectReasonComponent', () => {
  let component: TenderRejectReasonComponent;
  let fixture: ComponentFixture<TenderRejectReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderRejectReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderRejectReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
