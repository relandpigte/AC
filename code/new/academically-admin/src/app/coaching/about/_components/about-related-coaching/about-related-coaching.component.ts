import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto, CoachingsServiceProxy, CourseDto, DateGrains } from '@shared/service-proxies/service-proxies';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-about-related-coaching',
  templateUrl: './about-related-coaching.component.html',
  styleUrls: ['./about-related-coaching.component.less']
})
export class AboutRelatedCoachingComponent extends AppComponentBase implements OnInit {
  relatedCoaching: CoachingDto[] = Array(4).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _coachingService: CoachingsServiceProxy
  ) {
    super(injector);
  }

  get shimmerType() { return ShimmerType; }
  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
    this.getRelatedCoaching();
  }

  private getRelatedCoaching(): void {
    this._coachingService
      .getByDates(
        this.appSession.userId,
        undefined,
        undefined,
        undefined,
        DateGrains.Aged30,
        undefined,
        0,
        4
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {})
      )
      .subscribe((pagedCoachings) => {
        const coachings = pagedCoachings;
        if (coachings) {
          this.relatedCoaching = [];
          Object.keys(coachings).forEach((range) => {
            this.relatedCoaching = _.concat(
              this.relatedCoaching,
              coachings[range]?.items
            );
            this.relatedCoaching = _.take(this.relatedCoaching, 4);
          });
        }
      });
  }
}
