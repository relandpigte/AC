import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageOverviewComponent } from './usage-overview.component';

describe('UsageOverviewComponent', () => {
  let component: UsageOverviewComponent;
  let fixture: ComponentFixture<UsageOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
