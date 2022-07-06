import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsAttendeeClosedComponent } from './polls-attendee-closed.component';

describe('PollsAttendeeClosedComponent', () => {
  let component: PollsAttendeeClosedComponent;
  let fixture: ComponentFixture<PollsAttendeeClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsAttendeeClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsAttendeeClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
