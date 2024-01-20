import { Component, Injector, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

import { AppComponentBase } from '@shared/app-component-base';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { CoachingDto, ServiceBookingDto, TimeZoneDto, TimeZonesServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { Utils } from '@shared/helpers/utils';
import { pageType } from '@shared/services/posts-state.service';

enum timeline {
  days = 'days',
  hours = 'hours',
  minutes = 'minutes',
  seconds = 'seconds'
}

@Component({
  selector: 'app-join-badge',
  templateUrl: './join-badge.component.html',
  styleUrls: ['./join-badge.component.less']
})
export class JoinBadgeComponent extends AppComponentBase implements OnInit, OnChanges, OnDestroy {
  @Input() data: CoachingDto;
  @Input() booking: ServiceBookingDto;
  @Output() onReview = new Subject<CoachingDto>();
  @Output() onPurchase = new Subject<CoachingDto>();
  @Output() onCancel = new Subject<CoachingDto>();
  @Output() onReschedule = new Subject<CoachingDto>();

  countdown = 0;
  timeline: timeline = timeline.seconds;
  userTimeZone: TimeZoneDto;
  shimmerType = ShimmerType;

  private clearTimer: VoidFunction | undefined;
  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService,
    private _timeZonesService: TimeZonesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get isPurchased(): boolean { return this.data?.isPurchased; }
  get hasReviewed(): boolean { return this.data?.hasReviewed; }
  get eventId(): string { return this.data?.id; }
  get eventCancelled(): boolean { return this.data?.isCancelled; }
  get eventFinished(): boolean { return this.countdown <= 0; }
  get completedText(): string { return this.l('CompletedEvent', 'coaching'); }
  get userTimezoneName(): string { return this.userTimeZone?.ianaName; }

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if ('booking' in changes && !_.isEmpty(this.booking)) {
      try {
        this.userTimeZone = await this._timeZonesService.getByUser(this.currentUserId).toPromise();
        this.initJoinBadge();
        this.initCountDown();
      } catch (err) {
        console.error(err);
      }
    }
  }

  handleLeaveReview(): void {
    this.onReview.next(this.data);
  }

  handlePurchase(): void {
    this.onPurchase.next(this.data);
  }

  handleCancelClick(): void {
    this.onCancel.next(this.data);
  }

  handleRescheduleClick(): void {
    this.onReschedule.next(this.data);
  }

  handleExploreMore(): void {
    this._router.navigate(['/app/dashboard/coaching']);
  }

  async handleJoinClick(): Promise<void> {
    await this._router.navigate(['app/dashboard/events/portal/broadcast/student', this.eventId, 'portal']);
  }

  private initJoinBadge(): void {
    const bookedDate = moment(this.booking?.bookingDateTime);
    const now = moment.tz(this.userTimezoneName);
    const days = bookedDate.clone().diff(now, 'days');
    const hours = bookedDate.clone().diff(now, 'hours');
    const minutes = bookedDate.clone().diff(now, 'minutes');
    const seconds = bookedDate.clone().diff(now, 'seconds');

    if (days > 0) {
      this.countdown = days;
      this.timeline = timeline.days;
      return;
    } else if (hours > 0) {
      this.countdown = hours;
      this.timeline = timeline.hours;
      return;
    } else if (minutes > 0) {
      this.countdown = minutes;
      this.timeline = timeline.minutes;
      return;
    } else if (seconds > 0) {
      this.countdown = seconds;
      this.timeline = timeline.seconds;
      return;
    } else {
      this.countdown = 0;
      this.timeline = timeline.seconds;
      return;
    }
  }

  private initCountDown(): void {
    if (this.countdown > 60 || this.timeline !== timeline.seconds) {
      return;
    }
    this.clearTimer?.();
    const interval = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        this.clearTimer?.();
      }
    }, 1000);
    this.clearTimer = () => clearInterval(interval);
  }

  private getTimeDifference( date: Date ): any {
    const bookingDate = new Date(date).getTime();
    const now = new Date().getTime();
    const milliSecondsDiff = bookingDate - now;

    const days = Math.floor(milliSecondsDiff / 1000 / 60 / (60 * 24));
    const dateDiff = new Date( milliSecondsDiff );

    return days + " Days "+ dateDiff.getHours() + " Hours " + dateDiff.getMinutes() + " Minutes " + dateDiff.getSeconds() + " Seconds";
  }
}
