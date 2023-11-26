import { Component, Injector, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto, CoachingStatus } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

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
  @Output() onReview = new Subject<CoachingDto>();
  @Output() onPurchase = new Subject<CoachingDto>();
  @Output() onCancel = new Subject<CoachingDto>();
  @Output() onReschedule = new Subject<CoachingDto>();

  countdown = 0;
  timeline: timeline = timeline.seconds;

  shimmerType = ShimmerType;

  private clearTimer: VoidFunction | undefined;
  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService
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

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      this.initJoinBadge();
      this.initCountDown();
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
    const eventDateTime = moment().add(Math.floor(Math.random() * 10), 'days')
      .add(Math.floor(Math.random() * 24), 'hours')
      .add(Math.floor(Math.random() * 60), 'minutes')
      .add(Math.floor(Math.random() * 60), 'seconds');
    const days = eventDateTime.diff(moment(), 'days');
    const hours = eventDateTime.diff(moment(), 'hours');
    const minutes = eventDateTime.diff(moment(), 'minutes');
    const seconds = eventDateTime.diff(moment(), 'seconds');

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
}
