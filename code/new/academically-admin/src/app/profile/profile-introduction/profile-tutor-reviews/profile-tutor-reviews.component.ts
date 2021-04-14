import { Component, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { RatingExperienceType, RatingsServiceProxy, TutorRatingDto, TutorRatingDtoPagedResultDto, TutorRatingSummaryDto, UserDto } from '@shared/service-proxies/service-proxies';
import { ProfileService } from '@shared/services/profile.service';
import { finalize } from 'rxjs/operators';

class PagedTutorReviewsRequestDto extends PagedAndSortedRequestDto {
  studentIdFilter: number;
}

@Component({
  selector: 'app-profile-tutor-reviews',
  templateUrl: './profile-tutor-reviews.component.html',
  styleUrls: ['./profile-tutor-reviews.component.less']
})
export class ProfileTutorReviewsComponent extends PagedListingComponentBase<TutorRatingDto> {
  RatingExperienceType = RatingExperienceType;
  user: UserDto;
  tutorRatingSummary: TutorRatingSummaryDto = new TutorRatingSummaryDto();
  tutorRatings: TutorRatingDto[];
  isSummaryLoading = false;

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _ratingsService: RatingsServiceProxy,
  ) {
    super(injector);
    profileService.$user
      .subscribe(user => {
        this.user = user;
        this.getRatingSummary();
      });
    this.pageSize = 5;
  }

  list(request: PagedTutorReviewsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.studentIdFilter = this.user.id;

    this._ratingsService
      .getTutorRatings(
        request.studentIdFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: TutorRatingDtoPagedResultDto) => {
        this.tutorRatings = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private getRatingSummary(): void {
    this.isSummaryLoading = true;
    this._ratingsService.getTutorRatingSummary(this.user.id)
      .pipe(
        finalize(() => {
          this.isSummaryLoading = false;
        })
      )
      .subscribe(tutorRatingSummary => {
        this.tutorRatingSummary = tutorRatingSummary;
      });
  }
}
