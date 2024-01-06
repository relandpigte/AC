import {  Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ServiceReviewDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-service-review-card',
  templateUrl: './service-review.component.html',
  styleUrls: ['./service-review.component.less']
})
export class ServiceReviewComponent extends AppComponentBase {
  @Input() review: ServiceReviewDto;

  constructor(injector: Injector) {
    super(injector);
  }

  get isHighlighted() { return this.review?.isFromNotification; }
  get shimmerType() { return ShimmerType; }
  get userRatingAvatar(): string { return this.review?.creatorUser?.profilePictureUrl; }
  get userRatingName(): string { return this.review?.creatorUser?.fullName; }
  get userRatingDate(): string { return this.convertMomentToDateAgo(this.review?.creationTime, true); }
  get userReviewComment() { return this.removeHTMLTags(this.review?.comments); }
  get userRatingValue(): number { return this.review?.rating; }
  get isOwner(): boolean { return this.review?.creatorUser?.id === this.currentUserId; }
}
