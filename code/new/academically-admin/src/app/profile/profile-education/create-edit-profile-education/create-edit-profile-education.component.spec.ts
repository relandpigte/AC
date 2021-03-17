import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditProfileEducationComponent } from './create-edit-profile-education.component';

describe('CreateEditProfileEducationComponent', () => {
  let component: CreateEditProfileEducationComponent;
  let fixture: ComponentFixture<CreateEditProfileEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditProfileEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditProfileEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
