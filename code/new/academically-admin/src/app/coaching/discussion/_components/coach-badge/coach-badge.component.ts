import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

@Component({
  selector: 'app-coach-badge',
  templateUrl: './coach-badge.component.html',
  styleUrls: ['./coach-badge.component.less']
})
export class CoachBadgeComponent extends AppComponentBase implements OnInit {

  shimmerType = ShimmerType;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }

  ngOnInit(): void {
  }

}
