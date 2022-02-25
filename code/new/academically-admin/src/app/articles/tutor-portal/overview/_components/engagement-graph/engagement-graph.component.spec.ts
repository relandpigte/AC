import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementGraphComponent } from './engagement-graph.component';

describe('EngagementGraphComponent', () => {
  let component: EngagementGraphComponent;
  let fixture: ComponentFixture<EngagementGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngagementGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
