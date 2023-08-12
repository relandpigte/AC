import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-attendees-badge',
  templateUrl: './attendees-badge.component.html',
  styleUrls: ['./attendees-badge.component.less']
})
export class AttendeesBadgeComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }

}
