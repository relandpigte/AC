import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less']
})
export class CourseComponent extends  AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router
  ) {
    super(injector);
  }

  get isAboutTab(): boolean { return this._router.url.includes(['course', 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes(['course', 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes(['course', 'reviews'].join('/')); }

  ngOnInit(): void {
  }
}
