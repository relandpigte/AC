import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { LandingPagesService } from '@shared/services/landing-pages.service';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [accountModuleAnimation()]
})
export class CoachingComponent extends  AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isAboutTab(): boolean { return this._router.url.includes(['coaching', 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes(['coaching', 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes(['coaching', 'reviews'].join('/')); }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
  }
}
