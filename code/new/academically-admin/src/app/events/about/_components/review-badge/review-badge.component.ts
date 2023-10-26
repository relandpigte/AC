import { Component, Injector, Input, OnInit } from '@angular/core';
import { EventCategory, EventDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-review-badge',
  templateUrl: './review-badge.component.html',
  styleUrls: ['./review-badge.component.less']
})
export class ReviewBadgeComponent extends AppComponentBase implements OnInit {
  @Input() data: EventDto;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get eventCategoryName(): string { return this.data?.category === EventCategory.Broadcast ? 'Broadcast' : 'Workshop'; }
  get rating(): number { return this.data?.review?.rating; }

  ngOnInit(): void {
  }
}
