import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderAcceptReasonComponent } from './tender-accept-reason.component';

describe('TenderAcceptReasonComponent', () => {
  let component: TenderAcceptReasonComponent;
  let fixture: ComponentFixture<TenderAcceptReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderAcceptReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderAcceptReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
