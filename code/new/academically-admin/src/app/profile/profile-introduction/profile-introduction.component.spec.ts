import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIntroductionComponent } from './profile-introduction.component';

describe('ProfileIntroductionComponent', () => {
  let component: ProfileIntroductionComponent;
  let fixture: ComponentFixture<ProfileIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
