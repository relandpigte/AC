import { Component, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Injector } from '@node_modules/@angular/core';
import { combineLatest, of } from 'rxjs';
import { UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-presenters-badge',
  templateUrl: './presenters-badge.component.html',
  styleUrls: ['./presenters-badge.component.less']
})
export class PresentersBadgeComponent extends AppComponentBase implements OnInit {
  isLoading_usersYouMayKnow = true;
  usersYouMayKnowMaxItems = 0;
  usersYouMayKnow: UserDto[] = Array(5).fill([]).map(() => this.generateRandomUser()) as UserDto[];

  constructor(
    injector: Injector,
    private _usersService: UserServiceProxy,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest([ this.isLoading_usersYouMayKnow, this._landingPageService.isLoading$ ]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }

  ngOnInit(): void {
    this.loadInfiniteData(this._usersService, 'getAll', ['', true, true, 'creationTime desc', 0, 6], 'usersYouMayKnow');
  }

}
