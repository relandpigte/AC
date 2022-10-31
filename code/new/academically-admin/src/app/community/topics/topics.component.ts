import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.less'],
  animations: [appModuleAnimation()],
})
export class TopicsComponent extends AppComponentBase implements OnInit, OnDestroy {

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    super(injector);
  }

  get pageHeadingSuperscript(): string { return this._router.url.includes(['community', 'topics', 'following'].join('/')) ? 'Community.Header2' : 'Community.Header1'; }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
