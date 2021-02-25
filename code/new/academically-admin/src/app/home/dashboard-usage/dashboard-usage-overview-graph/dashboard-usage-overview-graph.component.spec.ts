import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsageOverviewGraphComponent } from './dashboard-usage-overview-graph.component';

describe('DashboardUsageOverviewGraphComponent', () => {
  let component: DashboardUsageOverviewGraphComponent;
  let fixture: ComponentFixture<DashboardUsageOverviewGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUsageOverviewGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUsageOverviewGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
