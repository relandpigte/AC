import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageOverviewGraphComponent } from './usage-overview-graph.component';

describe('UsageOverviewGraphComponent', () => {
  let component: UsageOverviewGraphComponent;
  let fixture: ComponentFixture<UsageOverviewGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageOverviewGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageOverviewGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
