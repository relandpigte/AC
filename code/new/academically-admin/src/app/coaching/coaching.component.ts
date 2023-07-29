import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less']
})
export class CoachingComponent extends  AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router
  ) {
    super(injector);
  }

  get isAboutTab(): boolean { return this._router.url.includes(['coaching', 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes(['coaching', 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes(['coaching', 'reviews'].join('/')); }

  ngOnInit(): void {
  }
}
