import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditSchedulesComponent } from './create-edit-schedules.component';

describe('CreateEditSchedulesComponent', () => {
  let component: CreateEditSchedulesComponent;
  let fixture: ComponentFixture<CreateEditSchedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditSchedulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
