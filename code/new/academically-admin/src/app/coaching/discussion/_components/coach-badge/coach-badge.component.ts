import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { CoachingDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-coach-badge',
  templateUrl: './coach-badge.component.html',
  styleUrls: ['./coach-badge.component.less']
})
export class CoachBadgeComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;

  @Input() data: CoachingDto;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService
  ) {
    super(injector);
  }

  get profilePictureUrl(): string { return this.getProfilePictureUrl(this.data?.creatorUser?.profilePictureDocument); }
  get profileFullName(): string { return this.data?.creatorUser?.fullName; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get ownerName(): string { return this.data?.creatorUser?.fullName; }

  ngOnInit(): void {}

  onMessageClick(): void {
    this._chatService.openChat$.next();
  }
}
