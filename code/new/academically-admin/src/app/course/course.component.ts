import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { AppComponentBase } from '@shared/app-component-base';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less'],
  animations: [accountModuleAnimation()]
})
export class CourseComponent extends  AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router,
    private _landingPageService: LandingPagesService
  ) {
    super(injector);
  }

  get isAboutTab(): boolean { return this._router.url.includes(['course', 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes(['course', 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes(['course', 'reviews'].join('/')); }

  ngOnInit(): void {
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
  }
}
