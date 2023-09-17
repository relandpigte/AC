import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CoachingDto } from '@shared/service-proxies/service-proxies';
import { pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-coach-badge',
  templateUrl: './coach-badge.component.html',
  styleUrls: ['./coach-badge.component.less']
})
export class CoachBadgeComponent extends AppComponentBase implements OnInit {
  data: CoachingDto;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get ownerName(): string { return this.data?.creatorUser?.fullName; }

  ngOnInit(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(d => this.data = d);
  }

  onMessageClick(): void {
    this._chatService.openChat$.next();
  }
}
