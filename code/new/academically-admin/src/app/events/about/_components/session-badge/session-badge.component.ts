import { Component, Injector, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { EventCategory, EventDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-session-badge',
  templateUrl: './session-badge.component.html',
  styleUrls: ['./session-badge.component.less']
})
export class SessionBadgeComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;

  @Input() data: EventDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get description(): string { return this.data?.description; }
  get spaceLeft(): number { return this.data?.numberOfAttendees - this.attendeesTotal; }
  get isWorkShop(): boolean { return this.data?.category === EventCategory.Workshop; }
  get attendeesTotal(): number { return this.data?.purchased?.length; }
  get duration(): number { return this.data?.duration; }
  get eventDate(): string { return moment(this.data?.eventDateTime).format('ddd, DD MMM YYYY'); }
  get eventStartTime(): string { return moment(this.data?.eventDateTime).format('HH:mm'); }
  get eventEndTime(): string { return moment(this.data?.eventDateTime).add(this.duration, 'minutes').format('HH:mm'); }

  ngOnInit(): void {}
}
