import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

@Component({
  selector: 'app-service-review',
  templateUrl: './service-review.component.html',
  styleUrls: ['./service-review.component.less']
})
export class ServiceReviewComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get shimmerType() { return ShimmerType; }

  ngOnInit(): void {
  }

}
