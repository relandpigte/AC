import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRatingSummaryComponent } from './course-rating-summary.component';

describe('CourseRatingSummaryComponent', () => {
  let component: CourseRatingSummaryComponent;
  let fixture: ComponentFixture<CourseRatingSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseRatingSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseRatingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
