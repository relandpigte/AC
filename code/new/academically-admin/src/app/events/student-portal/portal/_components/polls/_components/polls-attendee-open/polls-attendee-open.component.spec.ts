import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsAttendeeOpenComponent } from './polls-attendee-open.component';

describe('PollsAttendeeOpenComponent', () => {
  let component: PollsAttendeeOpenComponent;
  let fixture: ComponentFixture<PollsAttendeeOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsAttendeeOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsAttendeeOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
