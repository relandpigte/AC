import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilitySettingComponent } from './availability-setting.component';

describe('AvailabilitySettingComponent', () => {
  let component: AvailabilitySettingComponent;
  let fixture: ComponentFixture<AvailabilitySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilitySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilitySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
