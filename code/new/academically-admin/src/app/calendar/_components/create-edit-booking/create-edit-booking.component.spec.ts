import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditBookingComponent } from './create-edit-booking.component';

describe('CreateEditBookingComponent', () => {
  let component: CreateEditBookingComponent;
  let fixture: ComponentFixture<CreateEditBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
