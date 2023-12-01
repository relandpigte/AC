import { Component, Injector, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { AppComponentBase } from '@shared/app-component-base';
import { ServiceReviewDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-badge',
  templateUrl: './review-badge.component.html',
  styleUrls: ['./review-badge.component.less']
})
export class ReviewBadgeComponent extends AppComponentBase {
  @Input() review: ServiceReviewDto;
  @Output() onPurchase = new Subject<any>();

  constructor(injector: Injector) {
    super(injector);
  }

  get hasReviewed(): boolean { return !_.isEmpty(this.review); }
  get rating(): number { return this.review?.rating; }

  handlePurchase(): void {
    this.onPurchase.next();
  }
}
