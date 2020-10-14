import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsBusinessProfileComponent } from './jobs-business-profile.component';

describe('JobsBusinessProfileComponent', () => {
  let component: JobsBusinessProfileComponent;
  let fixture: ComponentFixture<JobsBusinessProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsBusinessProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsBusinessProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
