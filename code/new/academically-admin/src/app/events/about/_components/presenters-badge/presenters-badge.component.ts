import { Component, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Injector } from '@node_modules/@angular/core';
import { EventDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-presenters-badge',
  templateUrl: './presenters-badge.component.html',
  styleUrls: ['./presenters-badge.component.less']
})
export class PresentersBadgeComponent extends AppComponentBase implements OnInit {
  usersYouMayKnowMaxItems = 0;
  usersYouMayKnow: UserDto[] = Array(5).fill([]).map(() => this.generateRandomUser()) as UserDto[];

  @Input() data: EventDto;

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
