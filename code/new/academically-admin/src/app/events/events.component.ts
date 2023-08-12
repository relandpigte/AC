import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { AppComponentBase } from '@shared/app-component-base';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [accountModuleAnimation()]
})
export class EventsComponent extends  AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isAboutTab(): boolean { return this._router.url.includes(['events', 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes(['events', 'discussion'].join('/')); }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
  }
}
