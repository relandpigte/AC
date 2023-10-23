import {  Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { RatingExperienceType, TutorRatingDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-service-review-card',
  templateUrl: './service-review.component.html',
  styleUrls: ['./service-review.component.less']
})
export class ServiceReviewComponent extends AppComponentBase implements OnInit {
  ratingExperienceType = RatingExperienceType;

  @Input() rating: any;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get shimmerType() { return ShimmerType; }
  get userRatingAvatar(): string {  return this.getProfilePictureUrl(this.rating?.reviewer?.profilePictureDocument); }
  get userRatingName(): string { return this.rating?.reviewer?.fullName; }
  get userRatingDate(): string { return this.convertMomentToDateAgo(this.rating?.creationTime); }
  get userReviewComment() { return this.removeHTMLTags(this.rating?.comments); }
  get userRatingValue(): number { return this.rating?.totalRatingPercentage; }

  ngOnInit(): void {
  }

}
