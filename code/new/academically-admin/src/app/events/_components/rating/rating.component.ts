import { Component, Injector, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ServiceDataService } from '@shared/services/service-data.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEventRatingsDto, EventDto, RatingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.less']
})
export class RatingComponent extends AppComponentBase {
  @Input() data: EventDto;
  @Output() onSuccessReview = new Subject<boolean>();

  isLoading = false;
  model = new CreateEventRatingsDto();

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _ratingService: RatingsServiceProxy,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
  }

  get isFormValid(): boolean { return !!this.model.rating && !!this.model.comments; }

  onCloseClick(): void {
    this._modal.hide();
  }

  handleFormSubmit(): void {
    this.isLoading = true;
    this.model.eventId = this.data.id;
    this._ratingService.createEventRatings(this.model)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(review => {
        this.data.hasReviewed = true;
        this.data.review = review;
        this._serviceData.serviceData = this.data;
        this.onSuccessReview.next(true);
        this.onCloseClick();
      });
  }

  handleRatingUpdated(rating: number): void {
    this.model.rating = rating;
  }
}
