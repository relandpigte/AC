import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { EventCategory, EventDto, UserDto } from '@shared/service-proxies/service-proxies';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-attendees-badge',
  templateUrl: './attendees-badge.component.html',
  styleUrls: ['./attendees-badge.component.less']
})
export class AttendeesBadgeComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;

  @Input() data: EventDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }
  get attendeesTotal(): number { return this.data?.purchased?.length; }
  get attendeesLimit(): number { return this.data?.numberOfAttendees; }
  get attendees(): UserDto[] { return this.data?.purchased; }
  get isWorkShop(): boolean { return this.data?.category === EventCategory.Workshop; }

  ngOnInit(): void {
  }

}
