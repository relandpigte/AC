import { Component, Injector, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { RateAndReviewComponent } from '@shared/components/rate-and-review/rate-and-review.component';
import { CourseDto, RatingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceDataService } from '@shared/services/service-data.service';

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
    private _ratingService: RatingsServiceProxy
  ) {
    super(injector);
  }

  get courseId(): string { return this.data?.id; }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get serviceThumbnail(): string { return this.data?.courseImageUrl || 'assets/img/cover-photos/cp-1.jpeg'; }
  get progress(): number { return this.data?.progress; }
  get isCompleted(): boolean { return this.data?.progress === 100; }
  get isPurchased(): boolean { return this.data?.isPurchased; }
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
    const courses = this.data?.studentCourses?.find(s => s.progress < 100);
    let section = courses?.studentCourseSections?.find(s => s.status === 1)?.courseSection;
    if (courses?.progress === 0) {
      section = courses?.studentCourseSections[0]?.courseSection;
    }
    return section?.name;
  }

  async handleStartCourse(): Promise<void> {
    if (this.isCompleted) {
      const modalSettings = this.defaultModalSettings;
      modalSettings.class = 'modal-lg';
      modalSettings.initialState = { serviceId: this.courseId };
      const modal = this._modalService.show(RateAndReviewComponent, modalSettings).content;
      modal.onSuccessReview.subscribe(async (): Promise<void> => {
        this.data.hasReviewed = true;
        this._serviceData.serviceData = this.data;
        this._serviceData.serviceRating = await this._ratingService.getUserServiceReview(this.data?.id).toPromise();
      });

      modal.onClose.subscribe((): void => {
        this._modalService.hide();
      });
    } else {
      await this._router.navigate(['/app/student-portal', this.courseId, 'learn']);
    }
  }
}
