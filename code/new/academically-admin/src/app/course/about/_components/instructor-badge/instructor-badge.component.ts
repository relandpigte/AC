import { Component, Input, OnInit } from '@angular/core';
import { Injector } from '@node_modules/@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { ChatService } from '@shared/services/chat.service';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { CourseDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-instructor-badge',
  templateUrl: './instructor-badge.component.html',
  styleUrls: ['./instructor-badge.component.less']
})
export class InstructorBadgeComponent extends AppComponentBase implements OnInit {
  shimmerType = ShimmerType;

  @Input() data: CourseDto;

  constructor(
    injector: Injector,
    private _chatService: ChatService,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }
  get isLoading$() { return this._landingPageService.isLoading$; }
  get ownerName(): string { return this.data?.creatorUser?.fullName; }
  get ownerAbout() { return this.removeHTMLTags(this.data?.creatorUser?.about); }

  ngOnInit(): void {
  }

  onMessageClick(): void {
    this._chatService.openChat$.next();
  }
}
