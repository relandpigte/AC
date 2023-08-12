import { Component, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Injector } from '@node_modules/@angular/core';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-learn-badge',
  templateUrl: './learn-badge.component.html',
  styleUrls: ['./learn-badge.component.less']
})
export class LearnBadgeComponent extends AppComponentBase implements OnInit {

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }

}
