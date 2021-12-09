import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateAndReviewCourseComponent } from './rate-and-review-course.component';

describe('RateAndReviewCourseComponent', () => {
  let component: RateAndReviewCourseComponent;
  let fixture: ComponentFixture<RateAndReviewCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateAndReviewCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateAndReviewCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
