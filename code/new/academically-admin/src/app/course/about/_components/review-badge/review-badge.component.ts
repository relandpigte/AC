import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, ServiceReviewDto, ServiceReviewStats } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-badge',
  templateUrl: './review-badge.component.html',
  styleUrls: ['./review-badge.component.less']
})
export class ReviewBadgeComponent extends AppComponentBase {
  @Input() review: ServiceReviewDto;
  @Input() data: CourseDto;

  constructor(injector: Injector) {
    super(injector);
  }

  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get rating(): number { return this.review?.rating; }
}
