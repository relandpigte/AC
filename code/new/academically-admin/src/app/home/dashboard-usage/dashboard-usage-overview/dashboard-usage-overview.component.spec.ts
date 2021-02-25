import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsageOverviewComponent } from './dashboard-usage-overview.component';

describe('DashboardUsageOverviewComponent', () => {
  let component: DashboardUsageOverviewComponent;
  let fixture: ComponentFixture<DashboardUsageOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUsageOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUsageOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
