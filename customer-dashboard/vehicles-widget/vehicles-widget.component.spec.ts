import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesWidgetComponent } from './vehicles-widget.component';

describe('VehiclesWidgetComponent', () => {
  let component: VehiclesWidgetComponent;
  let fixture: ComponentFixture<VehiclesWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclesWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
