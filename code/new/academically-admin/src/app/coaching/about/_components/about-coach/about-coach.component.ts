import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-about-coach',
  templateUrl: './about-coach.component.html',
  styleUrls: ['./about-coach.component.less']
})
export class AboutCoachComponent extends AppComponentBase implements OnInit {

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService
  ) {
    super(injector);
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }

  onMessageClick(): void {
    this._chatService.openChat$.next();
  }
}
