import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditProfileEducationLevelComponent } from './create-edit-profile-education-level.component';

describe('CreateEditProfileEducationLevelComponent', () => {
  let component: CreateEditProfileEducationLevelComponent;
  let fixture: ComponentFixture<CreateEditProfileEducationLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditProfileEducationLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditProfileEducationLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
