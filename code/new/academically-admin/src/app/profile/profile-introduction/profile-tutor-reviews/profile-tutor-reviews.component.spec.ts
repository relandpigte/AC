import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTutorReviewsComponent } from './profile-tutor-reviews.component';

describe('ProfileTutorReviewsComponent', () => {
  let component: ProfileTutorReviewsComponent;
  let fixture: ComponentFixture<ProfileTutorReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTutorReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTutorReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
