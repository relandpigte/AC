import { Component, Injector, OnInit } from '@angular/core';
import { CourseService } from '@app/courses/_services/course.service';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import {
  CourseDto,
  CourseRatingDto,
  CourseRatingSummaryDto,
  RatingExperienceType,
  RatingsServiceProxy,
  TutorRatingDto,
  TutorRatingDtoPagedResultDto,
  UserDto
} from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

class PagedCourseReviewsRequestDto extends PagedAndSortedRequestDto {
  courseIdFilter: string;
}

@Component({
  selector: 'app-course-rating-summary',
  templateUrl: './course-rating-summary.component.html',
  styleUrls: ['./course-rating-summary.component.less']
})
export class CourseRatingSummaryComponent extends PagedListingComponentBase<CourseRatingDto>  {
  RatingExperienceType = RatingExperienceType;
  course: CourseDto;
  courseRatingSummary: CourseRatingSummaryDto = new CourseRatingSummaryDto();
  courseRatings: CourseRatingDto[];
  isSummaryLoading = false;

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _ratingsService: RatingsServiceProxy,
  ) {
    super(injector);

    this._courseService.course$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(course => {
        this.course = course;
        this.getRatingSummary();
      });
  }

  list(request: PagedCourseReviewsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.courseIdFilter = this.course.id;

    this._ratingsService
      .getCourseRatings(
        request.courseIdFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(result => {
        this.courseRatings = result.items;
        console.log(this.courseRatings);
        this.showPaging(result, pageNumber);
      });
  }

  private getRatingSummary(): void {
    this.isSummaryLoading = true;
    this._ratingsService.getCourseRatingSummary(this.course.id)
      .pipe(
        finalize(() => {
          this.isSummaryLoading = false;
        })
      )
      .subscribe(courseRatingSummary => {
        this.courseRatingSummary = courseRatingSummary;
      });
  }
}
