import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-workshop',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent extends  AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router
  ) {
    super(injector);
  }

  get isAboutTab(): boolean { return this._router.url.includes(['events', 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes(['events', 'discussion'].join('/')); }

  ngOnInit(): void {
  }
}
