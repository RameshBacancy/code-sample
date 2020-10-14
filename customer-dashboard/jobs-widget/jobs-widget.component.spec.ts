import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsWidgetComponent } from './jobs-widget.component';

describe('JobsWidgetComponent', () => {
  let component: JobsWidgetComponent;
  let fixture: ComponentFixture<JobsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
