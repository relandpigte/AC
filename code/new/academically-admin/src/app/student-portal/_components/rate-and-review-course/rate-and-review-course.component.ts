import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CourseDto,
  CreateCourseRatingAreaDto,
  CreateCourseRatingDto,
  RatingAreaType,
  RatingExperienceType,
  ServicesType,
  StudentCoursesServiceProxy,
  UserLoginInfoDto
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rate-and-review-course',
  templateUrl: './rate-and-review-course.component.html',
  styleUrls: ['./rate-and-review-course.component.less']
})
export class RateAndReviewCourseComponent extends AppComponentBase implements OnInit {
  @Input() course: CourseDto;

  isLoading = false;
  creationTime = moment();
  comment = null;

  student: UserLoginInfoDto;
  RatingAreaType = RatingAreaType;
  RatingExperienceType = RatingExperienceType;

  model: CreateCourseRatingDto = new CreateCourseRatingDto();

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _appSession: AppSessionService,
    private _studentCourseService: StudentCoursesServiceProxy
  ) {
    super(injector);

    this.student = this._appSession.user;
  }

  get averageRating(): number {
    let ratingTotal = 0;
    _.forEach(this.model.courseRatingAreas, ratingArea => {
      ratingTotal += ratingArea.rating;
    });
    return ratingTotal / 5;
  }

  ngOnInit(): void {
    this.generateTestData();
  }

  onFormSubmit(): void {
    this.isLoading = true;

    this._studentCourseService.createCourseRatings(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('RateAndReviewSubmittionAlertMessage'));
        this.onCloseClick();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  getRatingAreaValue(area: RatingAreaType): number {
    const ratingArea = this.model.courseRatingAreas.find(r => r.areaType === area);
    return ratingArea?.rating ?? 0;
  }

  onExperienceTypeClick($event: any, experienceType: RatingExperienceType): void {
    if (!$event.target.checked) {
      $event.preventDefault();
      return;
    }

    this.model.experienceType = experienceType;
    this.generateCourseAreaRating();
  }

  generateTestData(): void {
    this.model.courseId = this.course.id;
    this.model.serviceType = ServicesType.Course;
    this.model.serviceOwnerId = this.course.creatorUserId;
    this.model.experienceType = RatingExperienceType.Neutral;
    this.generateCourseAreaRating();
  }

  generateCourseAreaRating(): void {
    this.model.courseRatingAreas = [];
    for (let i = 0; i < 5; i++) {
      const ratingArea = new CreateCourseRatingAreaDto();
      ratingArea.areaType = i;
      ratingArea.rating = this.generateAreaRating(this.model.experienceType);
      this.model.courseRatingAreas.push(ratingArea);
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
    const ratingArea = this.model.courseRatingAreas.find(r => r.areaType === area);
    if (ratingArea) {
      ratingArea.rating = rating;
    }
  }
}
