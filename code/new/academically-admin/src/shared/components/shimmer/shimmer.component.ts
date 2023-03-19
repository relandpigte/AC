import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

@Component({
  selector: 'app-shimmer',
  templateUrl: './shimmer.component.html',
  styleUrls: ['./shimmer.component.scss'],
})
export class ShimmerComponent extends AppComponentBase implements OnInit {
  @Input() show: boolean;
  @Input() shimmerType: ShimmerType;

  constructor(injector: Injector) {
    super(injector);
  }

  get ShimmerType() { return ShimmerType; }

  ngOnInit(): void {}
}
