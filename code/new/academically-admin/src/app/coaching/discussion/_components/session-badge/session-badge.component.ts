import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { takeUntil } from 'rxjs/operators';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CoachingDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-session-badge',
  templateUrl: './session-badge.component.html',
  styleUrls: ['./session-badge.component.less']
})
export class SessionBadgeComponent extends AppComponentBase implements OnInit {
  readonly showMoreLimit: number = 255;

  showMore = false;
  shimmerType = ShimmerType;

  @Input() data: CoachingDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get description(): string { return this.data?.description; }
  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get displayShowMore(): boolean { return this.description?.length > this.showMoreLimit; }
  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {}
}
