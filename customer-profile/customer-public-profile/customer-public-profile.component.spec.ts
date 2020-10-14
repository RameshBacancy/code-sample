import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPublicProfileComponent } from './customer-public-profile.component';

describe('CustomerPublicProfileComponent', () => {
  let component: CustomerPublicProfileComponent;
  let fixture: ComponentFixture<CustomerPublicProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPublicProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
