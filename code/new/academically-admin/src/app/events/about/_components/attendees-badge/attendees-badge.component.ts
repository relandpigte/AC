import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { UserDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-attendees-badge',
  templateUrl: './attendees-badge.component.html',
  styleUrls: ['./attendees-badge.component.less']
})
export class AttendeesBadgeComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
