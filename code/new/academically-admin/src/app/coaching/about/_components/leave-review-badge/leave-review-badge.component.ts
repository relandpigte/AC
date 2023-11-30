import { Component, Injector, Input, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { RateAndReviewComponent } from '@shared/components/rate-and-review/rate-and-review.component';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ThankYouComponent } from '@app/coaching/_components/thank-you/thank-you.component';
import { CoachingDto, CoachingsServiceProxy, RatingsServiceProxy, ServiceBookingDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-leave-review-badge',
  templateUrl: './leave-review-badge.component.html',
  styleUrls: ['./leave-review-badge.component.less']
})
export class LeaveReviewBadgeComponent extends AppComponentBase {
  @Input() data: CoachingDto;
  @Input() booking: ServiceBookingDto;
  @Output() onPurchase = new Subject<any>();

  constructor(
    injector: Injector,
    private _serviceData: ServiceDataService,
    private _ratingService: RatingsServiceProxy,
    private _modalService: BsModalService,
    private _coachingsService: CoachingsServiceProxy
  ) {
    super(injector);
  }

  get isPurchased(): boolean { return this.data?.isPurchased; }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get serviceId(): string { return this.data?.id; }
  get eventFinished(): boolean { return moment().isAfter(this.booking?.bookingDateTime); }

  handleLeaveReview(): void {
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
        this._serviceData.serviceData = await this._coachingsService.get(this.serviceId).toPromise();
        this._serviceData.serviceRating = await this._ratingService.getUserServiceReview(this.serviceId).toPromise();
        this._serviceData.serviceOverallRating = await this._ratingService.getServiceRatingsSummary(this.serviceId).toPromise();
      } catch (e) {
        console.error(e);
      }
    });

    modal.onClose.subscribe((): void => {
      this._modalService.hide();
    });
  }

  handlePurchase(): void {
    this.onPurchase.next();
  }
}
