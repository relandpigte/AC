import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIndustryExperienceComponent } from './profile-industry-experience.component';

describe('ProfileIndustryExperienceComponent', () => {
  let component: ProfileIndustryExperienceComponent;
  let fixture: ComponentFixture<ProfileIndustryExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileIndustryExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileIndustryExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
