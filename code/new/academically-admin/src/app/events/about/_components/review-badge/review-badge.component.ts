import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EventCategory, EventDto, ServiceReviewDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-badge',
  templateUrl: './review-badge.component.html',
  styleUrls: ['./review-badge.component.less']
})
export class ReviewBadgeComponent extends AppComponentBase implements OnInit {
  @Input() data: EventDto;
  @Input() review: ServiceReviewDto;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get eventCategoryName(): string { return this.data?.category === EventCategory.Broadcast ? 'Broadcast' : 'Workshop'; }
  get rating(): number { return this.review?.rating; }

  ngOnInit(): void {
  }
}
