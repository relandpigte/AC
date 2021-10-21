import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditAvailabilityComponent } from './create-edit-availability.component';

describe('CreateEditAvailabilityComponent', () => {
  let component: CreateEditAvailabilityComponent;
  let fixture: ComponentFixture<CreateEditAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
