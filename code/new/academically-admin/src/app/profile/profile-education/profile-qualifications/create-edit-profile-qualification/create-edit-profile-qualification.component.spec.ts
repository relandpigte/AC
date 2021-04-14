import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditProfileQualificationComponent } from './create-edit-profile-qualification.component';

describe('CreateEditProfileQualificationComponent', () => {
  let component: CreateEditProfileQualificationComponent;
  let fixture: ComponentFixture<CreateEditProfileQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditProfileQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditProfileQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
