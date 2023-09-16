import { Component, Injector, OnInit } from '@angular/core';
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
  get profileAboutText(): string | boolean { return this.removeTags(this.data?.creatorUser?.about); }
  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
    this._serviceData.serviceData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.data = data;
        console.log(data);
      });
  }

  onMessageClick(): void {
    this._chatService.openChat$.next();
  }

  private removeTags(str: string): string | boolean {
    if ((str === null) || (str === '') || str === undefined) {
      return false;
    } else {
      str = str.toString();
    }
    return str.replace( /(<([^>]+)>)/ig, '');
  }
}
