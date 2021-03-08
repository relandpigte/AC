import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIntroductionAboutComponent } from './profile-introduction-about.component';

describe('ProfileIntroductionAboutComponent', () => {
  let component: ProfileIntroductionAboutComponent;
  let fixture: ComponentFixture<ProfileIntroductionAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileIntroductionAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileIntroductionAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
