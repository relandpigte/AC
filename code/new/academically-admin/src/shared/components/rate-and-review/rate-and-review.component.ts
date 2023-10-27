import { Component, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AvailableServiceDto,
  CreateServiceRatingAreaDto,
  CreateServiceRatingDto,
  PostsServiceProxy,
  RatingAreaType,
  RatingExperienceType,
  RatingsServiceProxy,
  UserLoginInfoDto
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rate-and-review',
  templateUrl: './rate-and-review.component.html',
  styleUrls: ['./rate-and-review.component.less']
})
export class RateAndReviewComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() serviceId: string;
  @Input() inline: boolean;
  @Output() onSuccessReview = new Subject<any>();
  @Output() onClose = new Subject<any>();

  service: AvailableServiceDto;
  isLoading = false;
  creationTime = moment();
  comment = null;

  student: UserLoginInfoDto;
  RatingAreaType = RatingAreaType;
  RatingExperienceType = RatingExperienceType;

  model: CreateServiceRatingDto = new CreateServiceRatingDto();

  constructor(
    injector: Injector,
    private _appSession: AppSessionService,
    private _postsService: PostsServiceProxy,
    private _ratingsService: RatingsServiceProxy,
  ) {
    super(injector);

    this.student = this._appSession.user;
  }

  get averageRating(): number {
    let ratingTotal = 0;
    _.forEach(this.model.serviceRatingAreas, ratingArea => {
      ratingTotal += ratingArea.rating;
    });
    return ratingTotal / 5;
  }

  get serviceName(): string { return this.service?.name; }
  get title(): string { return this.inline ? this.l('LeaveAReview') : `${this.l('WriteAReviewFor')} ${this.serviceName}`; }

  async ngOnInit() {
    this.generateTestData();
    await this.retrieveService();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if ('serviceId' in changes && this.serviceId) {
      await this.retrieveService();
    }
  }

  async retrieveService(): Promise<void> {
    try {
      this.service = await this._postsService.getService(this.serviceId).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._ratingsService.createServiceRatings(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('RateAndReviewSubmittionAlertMessage'));
        this.onSuccessReview.next();
        this.onCloseClick();
      });
  }

  onCloseClick(): void {
    this.onClose.next();
  }

  getRatingAreaValue(area: RatingAreaType): number {
    const ratingArea = this.model.serviceRatingAreas?.find(r => r.areaType === area);
    return ratingArea?.rating ?? 0;
  }

  onExperienceTypeClick($event: any, experienceType: RatingExperienceType): void {
    if (!$event.target.checked) {
      $event.preventDefault();
      return;
    }

    this.model.experienceType = experienceType;
    this.generateServiceAreaRating();
  }

  generateTestData(): void {
    this.model.serviceId = this.serviceId;
    this.model.experienceType = RatingExperienceType.Neutral;
    this.generateServiceAreaRating();
  }

  generateServiceAreaRating(): void {
    this.model.serviceRatingAreas = [];
    for (let i = 0; i < 5; i++) {
      const ratingArea = new CreateServiceRatingAreaDto();
      ratingArea.areaType = i;
      ratingArea.rating = this.generateAreaRating(this.model.experienceType);
      this.model.serviceRatingAreas.push(ratingArea);
    }
  }

  generateAreaRating(areaType: RatingExperienceType): number {
    let rating = 3;
    switch (areaType) {
      case RatingExperienceType.Positive:
        rating = 5;
        break;
      case RatingExperienceType.Neutral:
        rating = 3;
        break;
      case RatingExperienceType.Negative:
        rating = 1;
    }
    return rating;
  }

  onRatingAreaUpdated(area: RatingAreaType, rating: number): void {
    const ratingArea = this.model.serviceRatingAreas?.find(r => r.areaType === area);
    if (ratingArea) {
      ratingArea.rating = rating;
    }
  }
}
