import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSeriesComponent } from './event-series.component';

describe('EventSeriesComponent', () => {
  let component: EventSeriesComponent;
  let fixture: ComponentFixture<EventSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
