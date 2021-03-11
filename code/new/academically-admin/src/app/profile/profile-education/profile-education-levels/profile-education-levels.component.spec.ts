import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEducationLevelsComponent } from './profile-education-levels.component';

describe('ProfileEducationLevelsComponent', () => {
  let component: ProfileEducationLevelsComponent;
  let fixture: ComponentFixture<ProfileEducationLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEducationLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEducationLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
