import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesBoxComponent } from './vehicles-box.component';

describe('VehiclesBoxComponent', () => {
  let component: VehiclesBoxComponent;
  let fixture: ComponentFixture<VehiclesBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclesBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
