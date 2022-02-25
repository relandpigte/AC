import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficGraphComponent } from './traffic-graph.component';

describe('TrafficGraphComponent', () => {
  let component: TrafficGraphComponent;
  let fixture: ComponentFixture<TrafficGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrafficGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
