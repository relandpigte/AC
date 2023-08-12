import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-curriculum-badge',
  templateUrl: './curriculum-badge.component.html',
  styleUrls: ['./curriculum-badge.component.less']
})
export class CurriculumBadgeComponent extends AppComponentBase implements OnInit {

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
