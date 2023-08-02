import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesBadgeComponent } from './attendees-badge.component';

describe('AttendeesBadgeComponent', () => {
  let component: AttendeesBadgeComponent;
  let fixture: ComponentFixture<AttendeesBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeesBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeesBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
