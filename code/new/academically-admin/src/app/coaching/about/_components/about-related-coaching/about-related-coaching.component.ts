import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto, CourseDto } from '@shared/service-proxies/service-proxies';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-about-related-coaching',
  templateUrl: './about-related-coaching.component.html',
  styleUrls: ['./about-related-coaching.component.less']
})
export class AboutRelatedCoachingComponent extends AppComponentBase implements OnInit {
  relatedCoaching: CoachingDto[] = Array(5).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get shimmerType() { return ShimmerType; }
  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }
}
