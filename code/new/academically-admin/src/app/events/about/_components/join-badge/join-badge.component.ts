import { Component, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { EventCategory, EventDto } from '@shared/service-proxies/service-proxies';

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
  @Input() data: EventDto;

  countdown = 0;
  timeline: timeline = timeline.seconds;

  private clearTimer: VoidFunction | undefined;
  constructor(
    injector: Injector,
    private _router: Router
  ) {
    super(injector);
  }

  get isPurchased(): boolean { return this.data?.isPurchased; }
  get eventId(): string { return this.data?.id; }
  get eventFinished(): boolean { return this.countdown <= 0; }
  get eventCategoryName(): string { return this.data?.category === EventCategory.Broadcast ? 'Broadcast' : 'Workshop'; }
  get completedText(): string { return this.l('CompletedEvent', this.eventCategoryName); }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      console.log('%c TODO: CHANGE EVENT DATE MANUALLY IN DATABASE FOR DEMO PURPOSES', 'font-weight: bold; color: lime');
      console.log(`%c DATE NOW: ${moment().format('dddd DD, YYYY HH:mm:ss')}`, 'color: lime');
      console.log(`%c SCHEDULE: ${moment(this.data?.eventDateTime).format('dddd DD, YYYY HH:mm:ss')}`, 'color: lime');
      this.initJoinBadge();
      this.initCountDown();
    }
  }

  async handleJoinClick(): Promise<void> {
    await this._router.navigate(['app/dashboard/events/portal/broadcast/student', this.eventId, 'portal']);
  }

  private initJoinBadge(): void {
    const eventDateTime = moment(this.data?.eventDateTime);
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
