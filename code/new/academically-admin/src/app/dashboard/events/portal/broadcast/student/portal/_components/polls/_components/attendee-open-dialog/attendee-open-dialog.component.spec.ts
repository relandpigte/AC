import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeOpenDialogComponent } from './attendee-open-dialog.component';

describe('AttendeeOpenDialogComponent', () => {
  let component: AttendeeOpenDialogComponent;
  let fixture: ComponentFixture<AttendeeOpenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeOpenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeOpenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
