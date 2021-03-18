import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileStudentReviewsComponent } from './profile-student-reviews.component';

describe('ProfileStudentReviewsComponent', () => {
  let component: ProfileStudentReviewsComponent;
  let fixture: ComponentFixture<ProfileStudentReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileStudentReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileStudentReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
