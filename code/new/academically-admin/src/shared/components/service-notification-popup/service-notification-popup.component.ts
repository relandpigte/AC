import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceCard, ServiceCardOptions } from '@shared/models/service-card.model';
import { CoachingDto, EventDto, ServiceBookingDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

export interface UpcomingEvent {
  booking: ServiceBookingDto;
  data: CoachingDto | EventDto;
}

@Component({
  selector: 'app-service-notification-popup',
  templateUrl: './service-notification-popup.component.html',
  styleUrls: ['./service-notification-popup.component.less'],
})
export class ServiceNotificationPopupComponent extends AppComponentBase implements OnChanges {
  @Input() upcomingEvent: UpcomingEvent;
  @Input() isClosing = false;

  @Output() onClose = new EventEmitter<UpcomingEvent>();

  sanitized: ServiceCard;
  sanitizedOptions: ServiceCardOptions;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  get data(): CoachingDto | EventDto { return this.upcomingEvent?.data; }
  get booking(): ServiceBookingDto { return this.upcomingEvent?.booking; }

  get schedule(): string {
    if (!this.booking) return 'Calculating...';
    const now = moment();
    if (moment(this.booking.bookingDateTime).diff(now, 'seconds') < 1) {
      return this.l('LiveNow');
    } else {
      return this.l('StartingIn', this.convertMomentToTimeRemaining(this.booking.bookingDateTime));
    }
  }
  get img(): string { return this.data?.thumbnailImageUrl ? this.data.thumbnailImageUrl : 'assets/img/img-placeholder.png'; }
  get name(): string { return this.data?.name; }
  get description(): string {
    if (this.data instanceof CoachingDto) {
      return `Coaching with ${this.data?.creatorUser?.fullName}`;
    } else {
      return this.sanitized?.type;
    }
  }

  get isCoaching(): boolean { return this.data instanceof CoachingDto; }

  ngOnChanges(changes: SimpleChanges) {
    if ('upcomingEvent' in changes && this.upcomingEvent) {
      const { options, service } = ServiceCardUtils.getSanitizeServiceData(this.data, {}, [], false);
      this.sanitized = service;
      this.sanitizedOptions = options;
      this.forceUpdateDom();
    }
  }

  private forceUpdateDom(): void {
    setTimeout(() => {
      this._cdr.detectChanges();
      this.forceUpdateDom();
    }, 1000);
  }

  handleCloseClick(e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.onClose.emit(this.upcomingEvent);
  }
}
