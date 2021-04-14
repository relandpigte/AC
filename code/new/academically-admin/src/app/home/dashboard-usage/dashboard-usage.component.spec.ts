import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsageComponent } from './dashboard-usage.component';

describe('DashboardUsageComponent', () => {
  let component: DashboardUsageComponent;
  let fixture: ComponentFixture<DashboardUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
