import { Component, Injector, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { RateAndReviewComponent } from '@shared/components/rate-and-review/rate-and-review.component';
import { CourseDto, CoursesServiceProxy, RatingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ThankYouComponent } from '@app/course/_components/thank-you/thank-you.component';

@Component({
  selector: 'app-start-badge',
  templateUrl: './start-badge.component.html',
  styleUrls: ['./start-badge.component.less']
})
export class StartBadgeComponent extends AppComponentBase {
  @Input() data: CourseDto;
  @Input() rating: number;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _serviceData: ServiceDataService,
    private _ratingService: RatingsServiceProxy,
    private _courseService: CoursesServiceProxy
  ) {
    super(injector);
  }

  get serviceId(): string {
    return this.data?.id;
  }

  get hasReviewed(): boolean {
    return this.data?.hasReviewed;
  }

  get serviceThumbnail(): string {
    return this.data?.courseImageUrl || 'assets/img/cover-photos/cp-1.jpeg';
  }

  get progress(): number {
    return this.data?.progress;
  }

  get isCompleted(): boolean {
    return this.data?.progress === 100;
  }

  get isPurchased(): boolean {
    return this.data?.isPurchased;
  }

  get startButton(): string {
    switch (this.progress) {
      case 0:
        return this.l('Start');
      case 100:
        return this.l('LeaveReview');
      default:
        return this.l('Continue');
    }
  }

  get currentLesson(): string {
    const course = this.data?.studentCourses?.find(x => x.creatorUserId === this.currentUserId);
    let inProgress = course?.studentCourseSections?.find(x => x.status === 1);
    if (inProgress === undefined) {
      inProgress = course?.studentCourseSections[0];
    }
    return inProgress?.courseSection?.name;
  }

  async handleStartCourse(): Promise<void> {
    if (this.isCompleted) {
      const modalSettings = this.defaultModalSettings;
      modalSettings.class = 'modal-lg modal-dialog-centered';
      modalSettings.initialState = {serviceId: this.serviceId};
      const modal = this._modalService.show(RateAndReviewComponent, modalSettings).content;
      modal.onSuccessReview.subscribe(async (): Promise<void> => {
        try {
          setTimeout(() => {
            modalSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
            this._modalService.show(ThankYouComponent, modalSettings);
          }, 200);
          this._serviceData.serviceData = await this._courseService.get(this.serviceId).toPromise();
          this._serviceData.serviceRating = await this._ratingService.getUserServiceReview(this.serviceId).toPromise();
          this._serviceData.serviceOverallRating = await this._ratingService.getServiceRatingsSummary(this.serviceId).toPromise();
        } catch (e) {
          console.error(e);
        }
      });

      modal.onClose.subscribe((): void => {
        this._modalService.hide();
      });
    } else {
      await this._router.navigate(['/app/student-portal', this.serviceId, 'learn']);
    }
  }
}
