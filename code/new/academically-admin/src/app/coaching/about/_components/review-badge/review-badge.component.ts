import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-review-badge',
  templateUrl: './review-badge.component.html',
  styleUrls: ['./review-badge.component.less']
})
export class ReviewBadgeComponent extends AppComponentBase {
  @Input() rating: number;

  constructor(injector: Injector) {
    super(injector);
  }

  get hasReviewed(): boolean { return !!this.rating; }
}
