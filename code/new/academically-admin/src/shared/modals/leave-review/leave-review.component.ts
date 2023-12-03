import { Component, Injector, Input, Output } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

import { ServiceDataService } from '@shared/services/service-data.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateServiceReviewDto, EventCategory, ServicesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.less']
})
export class LeaveReviewComponent extends AppComponentBase {
  @Input() data: any;
  @Input() inline: boolean;
  @Input() placeholder: string;
  @Output() onReviewSuccess = new Subject<any>();
  @Output() onCloseModal = new Subject<any>();

  isLoading = false;
  model = new CreateServiceReviewDto();

  constructor(
    injector: Injector,
    private _serviceServices: ServicesServiceProxy,
    private _serviceData: ServiceDataService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get isFormValid(): boolean { return !_.isEmpty(this.model) && !!this.model.comments && !!this.model.rating; }

  onCloseClick(): void {
    this.onCloseModal.next();
  }

  handleFormSubmit(): void {
    if (_.isEmpty(this.data)) {
      return;
    }
    this.isLoading = true;
    this.model.referenceId = this.data.id;
    this.model.serviceOwnerId = this.data.creatorUserId;
    this.model.serviceType = this.data.category === EventCategory.Broadcast ? ServicesType.Event : ServicesType.Workshop;

    this._serviceServices.saveServiceReview(this.model)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(review => {
        this.data.hasReviewed = true;
        this._serviceData.serviceData = this.data;
        this._serviceData.serviceReview = review;
        this.onReviewSuccess.next(review);
        this.onCloseClick();
        this.getUpdatedReviewStats();
      });
  }

  handleRatingUpdated(rating: number): void {
    this.model.rating = rating;
  }

  private getUpdatedReviewStats(): void {
    this._servicesService.getServiceReviewStats(this.model.referenceId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(x => this._serviceData.serviceReviewStats = x);
  }
}
