import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-badge',
  templateUrl: './review-badge.component.html',
  styleUrls: ['./review-badge.component.less']
})
export class ReviewBadgeComponent extends AppComponentBase {
  @Input() rating: number;
  @Input() data: CourseDto;

  constructor(injector: Injector) {
    super(injector);
  }

  get hasReviewed(): boolean { return this.data?.hasReviewed; }
}
