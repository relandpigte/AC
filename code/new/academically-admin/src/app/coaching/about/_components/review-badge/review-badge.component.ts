import { Component, Injector, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-review-badge',
  templateUrl: './review-badge.component.html',
  styleUrls: ['./review-badge.component.less']
})
export class ReviewBadgeComponent extends AppComponentBase {
  @Input() rating: number;
  @Output() onPurchase = new Subject<any>();

  constructor(injector: Injector) {
    super(injector);
  }

  get hasReviewed(): boolean { return !!this.rating; }

  handlePurchase(): void {
    this.onPurchase.next();
  }
}
