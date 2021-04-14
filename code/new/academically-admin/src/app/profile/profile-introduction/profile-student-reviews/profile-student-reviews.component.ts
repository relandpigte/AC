import { Component, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { RatingExperienceType, RatingsServiceProxy, StudentRatingDto, StudentRatingDtoPagedResultDto, StudentRatingSummaryDto, UserDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { finalize } from 'rxjs/operators';

class PagedStudentReviewsRequestDto extends PagedAndSortedRequestDto {
  studentIdFilter: number;
}

@Component({
  selector: 'app-profile-student-reviews',
  templateUrl: './profile-student-reviews.component.html',
  styleUrls: ['./profile-student-reviews.component.less']
})
export class ProfileStudentReviewsComponent extends PagedListingComponentBase<StudentRatingDto> {
  RatingExperienceType = RatingExperienceType;
  user: UserDto = new UserDto();
  studentRatingSummary: StudentRatingSummaryDto = new StudentRatingSummaryDto();
  studentRatings: StudentRatingDto[];
  isSummaryLoading = false;

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _ratingsService: RatingsServiceProxy,
  ) {
    super(injector);
    profileService.$user.subscribe(user => {
      this.user = user;
      this.getRatingSummary();
    });
    this.pageSize = 5;
  }

  list(request: PagedStudentReviewsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.studentIdFilter = this.user.id;

    this._ratingsService
      .getStudentRatings(
        request.studentIdFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: StudentRatingDtoPagedResultDto) => {
        this.studentRatings = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private getRatingSummary(): void {
    this.isSummaryLoading = true;
    this._ratingsService.getStudentRatingSummary(this.user.id)
    .pipe(
      finalize(() => {
        this.isSummaryLoading = false;
      })
    )
      .subscribe(studentRatingSummary => {
        this.studentRatingSummary = studentRatingSummary;
      });
  }
}
