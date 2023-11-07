import { Component, Injector, Input,  OnInit } from '@angular/core';
import {  takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CourseDto, RatingsServiceProxy, ServiceRatingSummaryDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-session-badge',
  templateUrl: './session-badge.component.html',
  styleUrls: ['./session-badge.component.less']
})
export class SessionBadgeComponent extends AppComponentBase implements OnInit {
  @Input() data: CourseDto;

  shimmerType = ShimmerType;
  courseRatingSummary: ServiceRatingSummaryDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get courseId(): string { return this.data?.id; }
  get description(): string { return this.data?.description; }
  get modules(): number { return this.data?.modules; }
  get lessons(): number { return this.data?.lessons; }
  get totalRatingPercentage(): number { return this.courseRatingSummary?.totalRatingPercentage; }

  ngOnInit(): void {
    this._serviceData.serviceOverallRating$.pipe(takeUntil(this.destroyed$)).subscribe(rating => this.courseRatingSummary = rating);
  }
}
