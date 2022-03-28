import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStartingComponent } from './event-starting.component';

describe('EventStartingComponent', () => {
  let component: EventStartingComponent;
  let fixture: ComponentFixture<EventStartingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventStartingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStartingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
