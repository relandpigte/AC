import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { takeUntil } from '@node_modules/rxjs/operators';
import { ServiceDataService } from '@shared/services/service-data.service';
import { CoachingDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-about-coach',
  templateUrl: './about-coach.component.html',
  styleUrls: ['./about-coach.component.less']
})
export class AboutCoachComponent extends AppComponentBase implements OnInit {
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
  get profileAboutText() { return this.removeHTMLTags(this.data?.creatorUser?.about); }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get isOwner(): boolean { return this.data?.creatorUserId === this.appSession.userId; }

  ngOnInit(): void {}

  onMessageClick(): void {
    this._chatService.openChat$.next();
  }
}
